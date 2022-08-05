const exportObjects = require("./calcCorrCoeff.js");
const lstm = require("./lstm.js");
var ss = require('simple-statistics')
const {MongoClient} = require('mongodb');
const express = require('express');
const app = express();
//const body = require('body-parser');
const axios = require('axios');
const cors = require('cors');
app.use(cors());
require('dotenv').config()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

// below 2 lines for deployment
const path = require("path") 
app.use(express.static(path.join(__dirname, "client", "build")))

const PORT = process.env.PORT || 5000;

var indexURL, cryptoURL;
var mongoURL = "mongodb+srv://mquander:"+process.env.mongoPW+"@cosc880cluster.6w14h3k.mongodb.net/test"; //  "mongodb://localhost:27017"
//live URL: 
// (test OR ?retryWrites=true&w=majority
var toISO, fromISO, toSec, fromSec;
var coinPrices = [], indexPrices = [], tempArr = [], scaledCoinPrices = [], scaledIndexPrices = [];
var returnObj = {arr1: [], arr2: [], scaledArr1: [], scaledArr2: [], coinRegLine: {}, scaledCoinRegLine: {}, indexRegLine: {}, coinEMA: [], indexEMA: [], lstmIndexObj: {}, corrCoeff: null};
var errorObj = {status: null, text: ''};

app.post("/data", function(req, res1){ // may need to change this url later
    console.log("new data request");
    returnObj.arr1 = []; returnObj.arr2 = []; returnObj.scaledArr1 = []; returnObj.scaledArr2 = []; returnObj.coinRegLine = {}; returnObj.indexRegLine = {}; returnObj.coinEMA = []; returnObj.indexEMA = []; lstmIndexObj= {}; returnObj.corrCoeff = null;
    
    var selectedCrypto =req.query.selectedCrypto;// 'selectedCrypto' from the front-end
    var selectedIndex = req.query.selectedIndex; // 'sectorIndex' from the front-end
    toISO = req.query.to; // YYYY-MM-DD format
    fromISO = req.query.from;  // YYYY-MM-DD format
    fromSec = (new Date(fromISO)).getTime()/1000; // date in seconds
    toSec = (new Date(toISO)).getTime()/1000; // date in seconds
    var lt90days = (toSec - fromSec < 7776000);
    var gt90days = (toSec - fromSec > 7776000);
    toSec+=50400; // increment seconds to get correct 'to' date
    //console.log(toSec - fromSec); process.exit();
    // alternative API is coinapi.io
    // access the blockchain API, process data with a callback function
    cryptoURL = 'https://api.coingecko.com/api/v3/coins/'+selectedCrypto+'/market_chart/range?vs_currency=usd&from='+fromSec+'&to='+toSec; 
    
    const cryptoRequest = axios.get(cryptoURL);
    filterIndexforURL(selectedIndex);
    const indexRequest = axios.get(indexURL);
    
    axios.all([cryptoRequest, indexRequest]).then(axios.spread(async (...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];

        coinPrices = responseOne.data.prices;
        if(coinPrices.length == 0) throw Error('Error, Please check the crypto input for your request');
        coinPrices.map(a => {
            a[0] = (new Date(a[0])).toISOString().slice(0, 10)
        }); // convert dates to YYYY-MM-DD
        
        var prices2 = [];
        // filter array to get last price of the day
        for(var i = 0; i < coinPrices.length-1; i++){
            if(coinPrices[i][0] != coinPrices[i+1][0]){
                prices2.push(coinPrices[i])
            }
        }
        prices2.push(coinPrices[coinPrices.length-1])
        coinPrices = prices2;
        prices2 = [];
        for(var i=0; i < coinPrices.length; i++){
            scaledCoinPrices.push( [coinPrices[i][0], (coinPrices[i][1]/coinPrices[0][1]) * 100] );
        }
        // if(lt90days){ // if timeline is < 90 days, filter array to get last price of the day
        //     var coinPrices2 = [];
        //     // for-loop to get the 20th price in list (last price of the day listed)
        //     for(var i = 19, j=0; i < coinPrices.length; i += 20, j++) {
        //         coinPrices2[j] = coinPrices[i]             
        //     }
        //     // for-loop to delete duplicate dates
        //     for(var i = coinPrices2.length-1; i > 1; i--) {
        //         if(coinPrices2[i][0] == coinPrices2[i-1][0])
        //             coinPrices2.splice(i, 1);          
        //     }
        //     coinPrices = coinPrices2; // reset value of coinPrices array
        // }

        // filter response data from nasdaq URL
        if(selectedIndex == 'oil'){ // false
            indexPrices = responseTwo.data.dataset.data;
            if(indexPrices.length == 0) throw 'Error, Please check the oil index input for your request';
            indexPrices.reverse();
        }else{
            tempArr = responseTwo.data.results; // response data from polygon api
            if(tempArr.length == 0) throw 'Error, Please check the index input for your request';
            tempArr.forEach(function(element){ // add converted date and closing price to array
                indexPrices.push([(new Date(element.t)).toISOString().slice(0, 10), element.c]);
            });        
        }

        for(var i=0; i < indexPrices.length; i++){
            scaledIndexPrices.push( [indexPrices[i][0], (indexPrices[i][1]/indexPrices[0][1]) * 100] );
        }
        //prices2 = coinPrices
        returnObj.arr1 = coinPrices;
        returnObj.arr2 = indexPrices;
        returnObj.scaledArr1= scaledCoinPrices;
        returnObj.scaledArr2= scaledIndexPrices
        coinPrices = [], indexPrices = [], scaledCoinPrices = [], scaledIndexPrices = [];
        
        // Last Observation Carried Forward function call to sync date timeline
        const LOCF = exportObjects.LOCF;
        LOCF(returnObj.arr1, returnObj.arr2);
        LOCF(returnObj.scaledArr1, returnObj.scaledArr2);

        /****************LSTM BEGIN*******************/
        /*if(gt90days){ 
            console.log("gt90days=true")
            var indexPricesLSTM = []
            for(var i=0; i < returnObj.arr2.length; i++){
                indexPricesLSTM.push([returnObj.arr2[i][0], returnObj.arr2[i][1]]);
            }
            returnObj.lstmIndexObj = await lstm.lstm(indexPricesLSTM);
        }*/
        /****************LSTM END ****************/

        // *********** Linear Regression BEGIN ***************
        //coinPrices=Array.from(returnObj.arr1); if(typeof coinPrices[0][0] === "number") process.exit();
        var tempPricesArr=[], tempPricesArr2=[];
        for(var i=0; i < returnObj.arr1.length; i++){
            tempPricesArr.push([i, returnObj.arr1[i][1]]); //populate array with 0 - n and coinPrices
            prices2.push([i, returnObj.scaledArr1[i][1]]); //populate array with 0 - n and scaledcoinPrices
            tempPricesArr2.push([i, returnObj.arr2[i][1]]);
        } //console.log(tempPricesArr); console.log(tempPricesArr2);
        
        returnObj.coinRegLine= ss.linearRegression(tempPricesArr);
        returnObj.scaledCoinRegLine = ss.linearRegression(prices2);
        //indexPrices=returnObj.arr2
        returnObj.indexRegLine= ss.linearRegression(tempPricesArr2);
        // *********** Linear Regression END ***************

        // *********** corr Coef BEGIN ***************
        const correlationCoefficient = exportObjects.correlationCoefficient;
        var tempCorrCoeff = correlationCoefficient(returnObj.arr1, returnObj.arr2, returnObj.arr1.length);
        returnObj.corrCoeff = tempCorrCoeff.toFixed(4);
        tempCorrCoeff = null;
        // *********** corr Coef END ***************

        // *********** calculateEMA BEGIN ***************
        var ema_time_period;
        (tempPricesArr.length > 90)? ema_time_period = 50 : ema_time_period = 8;
        const calculateEMA = exportObjects.calculateEMA;
        returnObj.coinEMA = calculateEMA(tempPricesArr, ema_time_period); //tempPricesArr.length a 1D array that represents EMA line
        returnObj.indexEMA = calculateEMA(tempPricesArr2, ema_time_period) // tempPricesArr2.length
        // *********** calculateEMA END ***************

        res1.statusCode = 200;
        console.log("end data request");
        res1.json(returnObj);
        //returnObj.arr1 = [], returnObj.arr2 = [], returnObj.corrCoeff = null;
    })).catch(errors => {console.log(errors);
        if(selectedIndex == 'oil'){
            errorObj.text = errors.response.quandl_error.message
            
        }else if(coinPrices.length == 0){
            errorObj.status = errors.response.status;
            errorObj.text = "'"+selectedCrypto + "' " + errors.response.statusText;
        //}else if(tempArr.length == 0){
           // errorObj.text = errors.message;
        }else if(indexURL == "null"){console.log("indexURL: null")
            errorObj.status = errors.response.status;
            errorObj.text = "Error, please choose a correct index"
        }else if(errors.response.status == 429){
            errorObj.status = errors.response.status;
            errorObj.text = errors.response.statusText + ', please wait 1 minute and try again';
            res1.statusCode = errors.response.status;
        }else if(errors.response.status != 200){
            errorObj.status = errors.response.status;
            errorObj.text = errors.response.statusText + ', please try again';
            res1.statusCode = errors.response.status;
            
        }console.log(errorObj)
        res1.statusCode = errors.response.status;
        coinPrices = [], indexPrices = [];
        res1.json(errorObj);
        
        });
});
// route to get index LSTM
app.post("/indexlstm", async function(req, res){
    console.log("begin index lstm request");
    var indexDates = [], indexPrices = [], inputToLSTM = []
    var lstmReturnObj = {}; 
    
    req.body.params.dates.forEach(a => {
        indexDates.push(a)
    })
    req.body.params.prices.forEach(a => {
        indexPrices.push(Number(a))
    })
    // console.log(cryptoDates); console.log(cryptoPrices);

    for(var i=0; i < indexPrices.length; i++){
        inputToLSTM.push([indexDates[i],indexPrices[i]]);
    }
    //console.log(inputToLSTM); process.exit()
    lstmReturnObj = await lstm.lstm(inputToLSTM);

    res.statusCode = 200;
    console.log("end index lstm request");
    res.json(lstmReturnObj);
    // call lstm
})

// route to get crypto LSTM
app.post("/cryptolstm", async function(req, res){
    console.log("begin lstm request");
    var cryptoDates = [], cryptoPrices = [], inputToLSTM = []
    var lstmReturnObj = {}; 
    
    req.body.params.dates.forEach(a => {
        cryptoDates.push(a)
    })
    req.body.params.prices.forEach(a => {
        cryptoPrices.push(Number(a))
    })
    // console.log(cryptoDates); console.log(cryptoPrices);

    for(var i=0; i < cryptoPrices.length; i++){
        inputToLSTM.push([cryptoDates[i],cryptoPrices[i]]);
    }
    //console.log(inputToLSTM); process.exit()
    lstmReturnObj = await lstm.lstm(inputToLSTM);

    res.statusCode = 200;
    console.log("end lstm request");
    res.json(lstmReturnObj);
    // call lstm
})

// server code for user login
app.post("/login", function(req, res){

    //console.log(req.query)
    const userObjInfo = { 
        "email" : req.query.email,
        "password" : req.query.password
        //"hash_pw" : req.hash_pw
    }
    MongoClient.connect(mongoURL, function(err, db){
        if(err) throw err;
        var dbo = db.db("crypto-index-db");
            dbo.collection('users').findOne({email: userObjInfo.email, password: userObjInfo.password}, {"password":0}, function(err, res2){
                if(res2 == null){
                    res.send("Error: user not found/invalid credentials")
                }else if(res2.email == userObjInfo.email){
                    res.send(res2);
                }
            });
    });
})

// server code for user creation/sign-up
app.post("/signup", function(req, res){
    
    if(req.query.password1 != req.query.password2)
        res.send("Error: invalid credentials")

    //console.log(req.query)
    const userObjInfo = {
        "user_ID" : (Math.floor(Math.random() * 200) + 100).toString(), 
        "fname" : req.query.firstName, 
        "lname" : req.query.lastName,
        "email" : req.query.email,
        "password" : req.query.password,
        "watchList" : { "cryptos" : [ ], "indexes" : [ ] }
        //"hash_pw" : ''
    }
    MongoClient.connect(mongoURL, function(err, db){
        if(err) throw err;
        var dbo = db.db("crypto-index-db");
            dbo.collection('users').findOne({"email": userObjInfo.email}, function(err, res2){

                if(res2 == null){
                    dbo.collection('users').insertOne(userObjInfo, function(err, res3){
                        console.log("User " + req.query.firstName + " added");
                    });
                    res.status(200).send("Account created!");                    
                }else if(res2.email == userObjInfo.email){// return 'email already in use'
                    res.status(401).send("Error: email already in use");
                }
            });
            
    });
})

// server code for user update
app.post("/update", function(req, res){
    
    const userObjInfo = {
        "user_ID" : req.query.user_ID, //(Math.floor(Math.random() * 200) + 100).toString(), 
        "fname" : req.query.firstName, 
        "lname" : req.query.lastName,
        "email" : req.query.email,
        "password" : req.query.password,
       // "watchList" : { "cryptos" : [req.query.watchList.cryptos], "indexes" : [req.query.watchList.indexes] }
        watchList : JSON.parse(req.query.watchList)
        // "watchList.indexes" : [req.query.watchList.indexes] 
        //"hash_pw" : ''
    }; 
   // console.log(userObjInfo.watchList); 
    //console.log(userObjInfo.watchList.cryptos);
    // const newValues = { $set: {watchList: {cryptos: [req.query.watchList.cryptos], indexes: [req.query.watchList.indexes]}} }
    var newValues = { $set: {watchList: userObjInfo.watchList} }; // console.log(newValues)
    MongoClient.connect(mongoURL, function(err, db){
        if(err) throw err;
        var dbo = db.db("crypto-index-db");
            dbo.collection('users').updateOne({user_ID : userObjInfo.user_ID}, newValues, function(err, res2){
                
                if(res2.modifiedCount == 1){
                    console.log('updated watchlist'); console.log(res2);
                    //dbo.collection('users').findOne({email: userObjInfo.email}, {"password":0}, function(err, res3){});
                        console.log("User " + userObjInfo.fname + " watchlist updated");
                    
                    res.status(200).send("Watchlist updated!");                    
                }else{// return 'watchlist not updated'
                    res.status(401).send("Error: watchlist not updated");
                }
            });
            
    });
})

// server code for deleting user
app.post("/delete", function(req, res){
    console.log("in server /delete")
    //console.log(req.query)
    const userObjInfo = { 
        "user_ID" : req.query.user_ID, 
        "fname" : req.query.firstName, 
        "lname" : req.query.lastName,
        "email" : req.query.email,
        "password" : req.query.password,
        "watchList" : JSON.parse(req.query.watchList)
    }
    var deleteQuery = {user_ID: userObjInfo.user_ID, email: userObjInfo.email}
    MongoClient.connect(mongoURL, function(err, db){
        if(err) throw err;
        var dbo = db.db("crypto-index-db");
            dbo.collection('users').deleteOne(deleteQuery, function(err, res2){
                console.log(res2);
                if(res2.deletedCount == 1){ //
                    
                    console.log("User " + req.query.firstName + " deleted");
                    res.status(200).send("user deleted"); 
                }else{
                    console.log("User " + userObjInfo.fname + " NOT deleted");
                    res.status(401).send("Error: user not deleted");
                }
            });
    });
})

/* alternative APIs for stocks: 
https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=cc792fcdb265ac18f5c47974aee7e52b
https://api.twelvedata.com/time_series?symbol=ixic&interval=5min&apikey=86b778d217a7433789478075ffb8397c *********  THIS ONE MORE RELIABLE
ixic -> NASDAQ; dji -> Dow Jones; spx -> S&P500
*/
function filterIndexforURL(index){
    switch(index){
        case "technology": 
            indexURL = "https://api.polygon.io/v2/aggs/ticker/QQQ/range/1/day/"+fromISO+"/"+toISO+"?adjusted=false&sort=asc&limit=1200&apiKey="+process.env.index_api_key;
            break;
        case 'finance':
            indexURL = "https://api.polygon.io/v2/aggs/ticker/XLF/range/1/day/"+fromISO+"/"+toISO+"?adjusted=false&sort=asc&limit=1200&apiKey="+process.env.index_api_key;
            break;
        case 'oil':
            indexURL = "https://data.nasdaq.com/api/v3/datasets/OPEC/ORB.json?start_date="+fromISO+"&end_date="+toISO+"&collapse=daily&api_key="+process.env.oil_api_key;
            // or indexURL = "https://api.polygon.io/v2/aggs/ticker/VDE/range/1/day/"+fromISO+"/"+toISO+"?adjusted=false&sort=asc&limit=1200&apiKey="+process.env.index_api_key;
            break;
        case 'consumercyclicals':
            indexURL = "https://api.polygon.io/v2/aggs/ticker/VCR/range/1/day/"+fromISO+"/"+toISO+"?adjusted=false&sort=asc&limit=1200&apiKey="+process.env.index_api_key;
            break;
        case 'healthcare':
            indexURL = "https://api.polygon.io/v2/aggs/ticker/XLV/range/1/day/"+fromISO+"/"+toISO+"?adjusted=false&sort=asc&limit=1200&apiKey="+process.env.index_api_key;
            break;
        case 'transportation':
            indexURL = "https://api.polygon.io/v2/aggs/ticker/IYT/range/1/day/"+fromISO+"/"+toISO+"?adjusted=false&sort=asc&limit=1200&apiKey="+process.env.index_api_key;
            break;
        case 'vix':
            indexURL = "https://api.polygon.io/v2/aggs/ticker/VIXY/range/1/day/"+fromISO+"/"+toISO+"?adjusted=false&sort=asc&limit=1200&apiKey="+process.env.index_api_key;
            break;
        case 'treasuries':
            indexURL = "https://api.polygon.io/v2/aggs/ticker/TLT/range/1/day/"+fromISO+"/"+toISO+"?adjusted=false&sort=asc&limit=1200&apiKey="+process.env.index_api_key;
            break;
        default:
            indexURL = "null";
    }
}
// convert dates from seconds to YYYY-MM-DD
// function convertDate(fromSec, toSec){
//     fromISO = (new Date(fromSec * 1000)).toISOString().slice(0, 10); 

//     toISO = (new Date(toSec * 1000)).toISOString().slice(0, 10);
// }
// convert date from YYYY-MM-DD to seconds
// function convertDateISOtoSec(fromISO, toISO){
//     fromSec = (new Date(fromISO)).getTime()/1000;

//     toSec = (new Date(toISO)).getTime()/1000;
// }

// for deployment
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
