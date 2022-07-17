const exportObjects = require("./calcCorrCoeff.js");
const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
app.use(cors());
require('dotenv').config()

// below 2 lines for deployment
const path = require("path") 
app.use(express.static(path.join(__dirname, "client", "build")))

const PORT = process.env.PORT || 5000;

var indexURL, cryptoURL;
var toISO, fromISO, toSec, fromSec;
var coinPrices = [], indexPrices = [], tempArr = [];
var returnObj = {arr1: coinPrices, arr2: indexPrices, corrCoeff: null};
var errorObj = {status: null, text: ''};
app.get("/data", function(req, res1){ // may need to change this url later
    
    var selectedCrypto =req.query.selectedCrypto;// 'selectedCrypto' from the front-end
    var selectedIndex = req.query.selectedIndex; // 'sectorIndex' from the front-end
    toISO = req.query.to; // YYYY-MM-DD format
    fromISO = req.query.from;  // YYYY-MM-DD format
    fromSec = (new Date(fromISO)).getTime()/1000; // date in seconds
    toSec = (new Date(toISO)).getTime()/1000; // date in seconds
    var lt90days = (toSec - fromSec < 7776000000);
    toSec+=50400; // increment seconds to get correct 'to' date
    
    // alternative API is coinapi.io
    // access the blockchain API, process data with a callback function
    cryptoURL = 'https://api.coingecko.com/api/v3/coins/'+selectedCrypto+'/market_chart/range?vs_currency=usd&from='+fromSec+'&to='+toSec; 
    
    const cryptoRequest = axios.get(cryptoURL);
    filterIndexforURL(selectedIndex);
    const indexRequest = axios.get(indexURL);
    
    axios.all([cryptoRequest, indexRequest]).then(axios.spread((...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];

        coinPrices = responseOne.data.prices;
        if(coinPrices.length == 0) throw Error('Error, Please check the crypto input for your request');
        coinPrices.map(a => {
            a[0] = (new Date(a[0])).toISOString().slice(0, 10)
        }); // convert dates to YYYY-MM-DD
        
        var prices2 = [];
        for(var i = 0; i < coinPrices.length-1; i++){
            if(coinPrices[i][0] != coinPrices[i+1][0]){
                prices2.push(coinPrices[i])
                //if(i == 0) console.log(prices[i][0]);
            }
        }
        prices2.push(coinPrices[coinPrices.length-1])
        coinPrices = prices2;

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
        
        returnObj.arr1 = coinPrices;
        returnObj.arr2 = indexPrices;
        coinPrices = [], indexPrices = [];
        
        // Last Observation Carried Forward function call to sync date timeline
        const LOCF = exportObjects.LOCF;
        LOCF(returnObj.arr1, returnObj.arr2);

        const correlationCoefficient = exportObjects.correlationCoefficient;
        returnObj.corrCoeff = correlationCoefficient(returnObj.arr1, returnObj.arr2, returnObj.arr1.length);
        
        res1.statusCode = 200;
        console.log(returnObj)
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
