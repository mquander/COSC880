import React from 'react';
import axios from 'axios';
import gif from './big-blue-button-loading.gif'; // from https://tenor.com/view/big-blue-button-loading-meeting-waiting-typing-gif-17116389
import GraphComponent from './GraphComponent';


var cryptoToSearch, indexToSearch, fromDate, toDate;

export default class BasicComponent extends React.Component {
  
  constructor(props) {
    console.log("in BasicComp constructor");
      super(props);
      // declare the initial state
      this.state = {
        returnData: {}, errorReturn: 0, tempArray1: [], tempArray2: [], corrCoef:0
      };
  }
  componentDidMount() {
    cryptoToSearch = this.props.arg;
    indexToSearch = this.props.arg2;
    fromDate = this.props.arg3;
    toDate = this.props.arg4;
    console.log("in BasicComp componentDidMount " + new Date());
    // GET request to the URL and set state to the data returned
    axios.get("/data", {params:{selectedCrypto: cryptoToSearch, selectedIndex: indexToSearch, from: fromDate, to: toDate}}).then(res => {

      if(res.status === 200){ 
        const returnData = res.data;
        this.setState({returnData: returnData});
        this.setState({tempArray1: returnData.arr1});
        this.setState({tempArray2: returnData.arr2});
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
  
  render(){
    console.log("in BasicComp render " + new Date());
    // 
    if(this.state.errorReturn){ console.log("error: "+this.state.errorReturn.data.text)
      return(<div><GraphComponent/><div style={{color:"red"}}><i>{this.state.errorReturn.data.text}</i></div></div>) //render blank Graph & error message
    }else{
      if(this.state.corrCoef === 0){// render blank initially
        return(<GraphComponent/>);
      }
      else{
        return (
    <div>
      <div ><GraphComponent cryptoArray={this.state.tempArray1} indexArray={this.state.tempArray2}/></div>
      Correlation Coefficient: {/*this.state.corrCoef?(this.state.corrCoef>0?this.state.corrCoef:this.state.corrCoef):<img src={gif} alt="" width="130px" height="50px"></img>*/} 
      {this.state.corrCoef?(this.state.corrCoef>0?<p style={{color:"green", display:"inline-block"}}>{this.state.corrCoef}</p>: <p style={{color:"red", display:"inline-block"}}>{this.state.corrCoef}</p>):<img src={gif} alt="" width="110px" height="40px"></img>}  &emsp;
      
    </div> 
      )
      }
      
    }
    
  };
}
