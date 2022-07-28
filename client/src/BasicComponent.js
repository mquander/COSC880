import React from 'react';
import axios from 'axios';
import gif from './big-blue-button-loading.gif'; // from https://tenor.com/view/big-blue-button-loading-meeting-waiting-typing-gif-17116389
import GraphComponent from './GraphComponent';
import Button from '@mui/material/Button';
import { UserContext } from "./App";
//import {  useNavigate } from "react-router";

var cryptoToSearch, indexToSearch, fromDate, toDate;

export default class BasicComponent extends React.Component {
  
  constructor(props) {
    console.log("in BasicComp constructor");
      super(props);
      // declare the initial state
      this.state = {
        returnData: {}, errorReturn: 0, tempArray1: [], tempArray2: [], corrCoef: -10, scaledArr1:[], scaledArr2:[], displayRaw: true, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false,
        display: "displayRaw"//{displayRaw: true, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false}
      };
  }
  componentDidMount() {
    cryptoToSearch = this.props.arg;
    indexToSearch = this.props.arg2;
    fromDate = this.props.arg3;
    toDate = this.props.arg4;
    console.log("in BasicComp componentDidMount " + new Date());
    // GET request to the URL and set state to the data returned, "/data"
    axios.get("/data", {params:{selectedCrypto: cryptoToSearch, selectedIndex: indexToSearch, from: fromDate, to: toDate}}).then(res => {

      if(res.status === 200){ 
        const returnData = res.data;
        this.setState({returnData: returnData});
        this.setState({tempArray1: returnData.arr1});
        this.setState({tempArray2: returnData.arr2});
        this.setState({scaledArr1: returnData.scaledArr1});
        this.setState({scaledArr2: returnData.scaledArr2});
        this.setState({corrCoef: returnData.corrCoeff})
        console.log(returnData);
      }else{
        const errorReturn = res.data;
        this.setState({errorReturn: errorReturn});
        console.log(errorReturn);
      }
            
    }).catch(error => {
      if(error.response.data.status >= 400){
        const errorReturn = error.response;
        this.setState({errorReturn: errorReturn});
        console.log("in catch"); console.log(errorReturn);
      }
    });
  }
  updateDB(){
    //if(this.context.user.loggedInUserData.watchList.cryptos.includes(cryptoToSearch))
    this.context.user.loggedInUserData.watchList.cryptos.push(cryptoToSearch); 
    this.context.user.loggedInUserData.watchList.indexes.push(indexToSearch);// console.log(this.context.user.loggedInUserData); console.log(this.context.user.loggedInUserData.watchList); console.log(this.context.user.loggedInUserData.watchList.cryptos);
    var paramsObj = {
      user_ID: this.context.user.loggedInUserData.user_ID,
      firstName: this.context.user.loggedInUserData.fname,
      lastName: this.context.user.loggedInUserData.lname,
      email : this.context.user.loggedInUserData.email,
      password : this.context.user.loggedInUserData.password,
      watchList: {"cryptos": this.context.user.loggedInUserData.watchList.cryptos, "indexes": this.context.user.loggedInUserData.watchList.indexes}
    }; console.log(paramsObj);
    axios.post("/update", {}, {params: paramsObj}).then(res => {
      console.log("watchlist updated (from BasicComp): ")
      console.log(res)
      if(res.status < 400){
        //setUser({ loggedIn: true });
        alert("Updated ok")
        // const navigate = useNavigate();
        // return navigate("/", { replace: true })
      }
    }).catch(error => {
      alert("Updated failed")
      console.log(error.response.data)
      alert(error.response.data)
    })
  }
  
  render(){BasicComponent.contextType = UserContext;
    console.log("in BasicComp render " + new Date());
    var buttonsRender;
    if(this.state.errorReturn){ console.log("error: "+this.state.errorReturn.data.text); console.log("graph render here: ")
      return(<div><GraphComponent/><div style={{color:"red"}}><i>{this.state.errorReturn.data.text}</i></div></div>) //render blank Graph & error message
    }else{
      if(this.state.corrCoef === -10){console.log("graph render here: ")// initial render is a blank graph - NEED TO change this to null, not 0
        return(<GraphComponent/>);
      }
      else{ //this else executes if there's data to display border: "1px solid red", 
        

        buttonsRender=(
          <div > 
          <div style={{justifyContent: "center" , alignItems: "center", display: "flex"}}>
            
            <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: true, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayScaled"})}}> View Scaled </Button>  &nbsp;
            <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={()=> {this.setState({displayRaw: true, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayRaw"})}}> View Raw </Button>  &nbsp;
            <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: true, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayCryptoLR"})}}> {cryptoToSearch}-LR </Button> &nbsp;
            <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: true, displayCryptoEMA: false, displayIndexEMA: false, display: "displayIndexLR"})}}> {indexToSearch}-LR </Button> &nbsp;
          </div>
          <div style={{justifyContent: "center" , alignItems: "center", display: "flex"}}>
            <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: true, displayIndexEMA: false, display: "displayCryptoEMA"})}}> {cryptoToSearch}-EMA </Button>  &nbsp;
            <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: true, display: "displayIndexEMA"})}}> {indexToSearch}-EMA </Button>  &nbsp;
            {((typeof this.context.user) !== "undefined" && this.context.user.loggedIn)?
             <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.updateDB()}}>Add to Watchlist</Button>:null}
          </div>
          </div>

            )


        if(this.state.displayRaw){console.log("graph render here: "); console.log("this.state.tempArray1: "+this.state.tempArray1)
          return(
            <div>
              <div ><GraphComponent cryptoArray={this.state.tempArray1} indexArray={this.state.tempArray2} display={this.state.display}/></div>
              Correlation Coefficient: {/*this.state.corrCoef?(this.state.corrCoef>0?this.state.corrCoef:this.state.corrCoef):<img src={gif} alt="" width="130px" height="50px"></img>*/} 
              {this.state.corrCoef?(this.state.corrCoef>0?<p style={{color:"green", display:"inline-block"}}>{this.state.corrCoef}</p>: <p style={{color:"red", display:"inline-block"}}>{(this.state.corrCoef).toFixed(4)}</p>):<img src={gif} alt="" width="110px" height="40px"></img>} 
              {buttonsRender}
              {/* <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: true, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayScaled"})}}> View Scaled </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={()=> {this.setState({displayRaw: true, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayRaw"})}}> View Raw </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: true, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayCryptoLR"})}}> {cryptoToSearch}-LR </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: true, displayCryptoEMA: false, displayIndexEMA: false, display: "displayIndexLR"})}}> {indexToSearch}-LR </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: true, displayIndexEMA: false, display: "displayCryptoEMA"})}}> {cryptoToSearch}-EMA </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: true, display: "displayIndexEMA"})}}> {indexToSearch}-EMA </Button>
              {((typeof this.context.user) !== "undefined" && this.context.user.loggedIn)?
               <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.updateDB()}}>Add to Watchlist</Button>:null}
               */}
            </div> 
              )
        }else if(this.state.displayScaled){console.log(this.state.scaledArr2) ; console.log("graph render here: ")
          return (
            <div>
              <div ><GraphComponent cryptoArray={this.state.scaledArr1} indexArray={this.state.scaledArr2} display={this.state.display}/></div>
              Correlation Coefficient: {/*this.state.corrCoef?(this.state.corrCoef>0?this.state.corrCoef:this.state.corrCoef):<img src={gif} alt="" width="130px" height="50px"></img>*/} 
              {this.state.corrCoef?(this.state.corrCoef>0?<p style={{color:"green", display:"inline-block"}}>{this.state.corrCoef}</p>: <p style={{color:"red", display:"inline-block"}}>{(this.state.corrCoef).toFixed(4)}</p>):<img src={gif} alt="" width="110px" height="40px"></img>}
              {buttonsRender}
              {/* <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: true, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayScaled"})}}> View Scaled </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={()=> {this.setState({displayRaw: true, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayRaw"})}}> View Raw </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: true, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayCryptoLR"})}}> {cryptoToSearch}-LR </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: true, displayCryptoEMA: false, displayIndexEMA: false, display: "displayIndexLR"})}}> {indexToSearch}-LR </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: true, displayIndexEMA: false, display: "displayCryptoEMA"})}}> {cryptoToSearch}-EMA </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: true, display: "displayIndexEMA"})}}> {indexToSearch}-EMA </Button> */}
            </div> 
              )
        }else if(this.state.displayCryptoLR){
          return (
            <div>
              <div ><GraphComponent cryptoArray={this.state.tempArray1} coinRegLine={this.state.returnData.coinRegLine}  display={this.state.display}/></div>
              Correlation Coefficient: {/*this.state.corrCoef?(this.state.corrCoef>0?this.state.corrCoef:this.state.corrCoef):<img src={gif} alt="" width="130px" height="50px"></img>*/} 
              {this.state.corrCoef?(this.state.corrCoef>0?<p style={{color:"green", display:"inline-block"}}>{this.state.corrCoef}</p>: <p style={{color:"red", display:"inline-block"}}>{(this.state.corrCoef).toFixed(4)}</p>):<img src={gif} alt="" width="110px" height="40px"></img>}
              {buttonsRender}
              {/* <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: true, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayScaled"})}}> View Scaled </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={()=> {this.setState({displayRaw: true, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayRaw"})}}> View Raw </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: true, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayCryptoLR"})}}> {cryptoToSearch}-LR </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: true, displayCryptoEMA: false, displayIndexEMA: false, display: "displayIndexLR"})}}> {indexToSearch}-LR </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: true, displayIndexEMA: false, display: "displayCryptoEMA"})}}> {cryptoToSearch}-EMA </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: true, display: "displayIndexEMA"})}}> {indexToSearch}-EMA </Button> */}
            </div> 
              )
        }else if(this.state.displayIndexLR){
          return (
            <div>
              <div ><GraphComponent indexArray={this.state.tempArray2} indexRegLine={this.state.returnData.indexRegLine}  display={this.state.display}/></div>
              Correlation Coefficient: {/*this.state.corrCoef?(this.state.corrCoef>0?this.state.corrCoef:this.state.corrCoef):<img src={gif} alt="" width="130px" height="50px"></img>*/} 
              {this.state.corrCoef?(this.state.corrCoef>0?<p style={{color:"green", display:"inline-block"}}>{this.state.corrCoef}</p>: <p style={{color:"red", display:"inline-block"}}>{(this.state.corrCoef).toFixed(4)}</p>):<img src={gif} alt="" width="110px" height="40px"></img>}
              {buttonsRender}
              {/* <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: true, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayScaled"})}}> View Scaled </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={()=> {this.setState({displayRaw: true, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayRaw"})}}> View Raw </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: true, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayCryptoLR"})}}> {cryptoToSearch}-LR </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: true, displayCryptoEMA: false, displayIndexEMA: false, display: "displayIndexLR"})}}> {indexToSearch}-LR </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: true, displayIndexEMA: false, display: "displayCryptoEMA"})}}> {cryptoToSearch}-EMA </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: true, display: "displayIndexEMA"})}}> {indexToSearch}-EMA </Button> */}
            </div> 
              )
        }else if(this.state.displayCryptoEMA){
          return (
            <div>
              <div ><GraphComponent cryptoArray={this.state.tempArray1} coinEMA={this.state.returnData.coinEMA}  display={this.state.display}/></div>
              Correlation Coefficient: {/*this.state.corrCoef?(this.state.corrCoef>0?this.state.corrCoef:this.state.corrCoef):<img src={gif} alt="" width="130px" height="50px"></img>*/} 
              {this.state.corrCoef?(this.state.corrCoef>0?<p style={{color:"green", display:"inline-block"}}>{this.state.corrCoef}</p>: <p style={{color:"red", display:"inline-block"}}>{(this.state.corrCoef).toFixed(4)}</p>):<img src={gif} alt="" width="110px" height="40px"></img>}
              {buttonsRender}
              {/* <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: true, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayScaled"})}}> View Scaled </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={()=> {this.setState({displayRaw: true, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayRaw"})}}> View Raw </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: true, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayCryptoLR"})}}> {cryptoToSearch}-LR </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: true, displayCryptoEMA: false, displayIndexEMA: false, display: "displayIndexLR"})}}> {indexToSearch}-LR </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: true, displayIndexEMA: false, display: "displayCryptoEMA"})}}> {cryptoToSearch}-EMA </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: true, display: "displayIndexEMA"})}}> {indexToSearch}-EMA </Button> */}
            </div> 
              )
        }else if(this.state.displayIndexEMA){console.log(this.state.returnData.indexEMA)
          return (
            <div>
              <div ><GraphComponent indexArray={this.state.tempArray2} indexEMA={this.state.returnData.indexEMA}  display={this.state.display}/></div>
              Correlation Coefficient: {/*this.state.corrCoef?(this.state.corrCoef>0?this.state.corrCoef:this.state.corrCoef):<img src={gif} alt="" width="130px" height="50px"></img>*/} 
              {this.state.corrCoef?(this.state.corrCoef>0?<p style={{color:"green", display:"inline-block"}}>{this.state.corrCoef}</p>: <p style={{color:"red", display:"inline-block"}}>{(this.state.corrCoef).toFixed(4)}</p>):<img src={gif} alt="" width="110px" height="40px"></img>} 
              {buttonsRender}
              {/* <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: true, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayScaled"})}}> View Scaled </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={()=> {this.setState({displayRaw: true, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayRaw"})}}> View Raw </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: true, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: false, display: "displayCryptoLR"})}}> {cryptoToSearch}-LR </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: true, displayCryptoEMA: false, displayIndexEMA: false, display: "displayIndexLR"})}}> {indexToSearch}-LR </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: true, displayIndexEMA: false, display: "displayCryptoEMA"})}}> {cryptoToSearch}-EMA </Button>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => {this.setState({displayRaw: false, displayScaled: false, displayCryptoLR: false, displayIndexLR: false, displayCryptoEMA: false, displayIndexEMA: true, display: "displayIndexEMA"})}}> {indexToSearch}-EMA </Button> */}
            </div> 
              )
        }
        
      }
      
    }
    
  };
}
