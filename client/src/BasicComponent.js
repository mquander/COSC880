import React from 'react';
import axios from 'axios';
import gif from './big-blue-button-loading.gif'; // from https://tenor.com/view/big-blue-button-loading-meeting-waiting-typing-gif-17116389
var cryptoToSearch, indexToSearch, fromDate, toDate;


 export default class BasicComponent extends React.Component {
  
  constructor(props) {
    console.log("in BasicComp constructor");
      super(props);
      // declare the initial state
      this.state = {
        returnData: {}, errorReturn: 0, tempArray1: [], tempArray2: [], corrCoef:0
       // cryptoToSearch: ''
      };
  }
  componentDidMount() {
    cryptoToSearch = this.props.arg;
    indexToSearch = this.props.arg2;
    fromDate = this.props.arg3;
    toDate = this.props.arg4;
    console.log("in BasicComp componentDidMount " + new Date());
    // GET request to the URL and set state to the data returned
    axios.get(process.env.REACT_APP_API_URL, {params:{selectedCrypto: cryptoToSearch, selectedIndex: indexToSearch, from: fromDate, to: toDate}}).then(res => {
      
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
    
    /* will need another component to plug data into graph and display*/
    if(this.state.errorReturn){ console.log("error: "+this.state.errorReturn.data.text)
      return(<div style={{color:"red"}}><i>{this.state.errorReturn.data.text}</i></div>)
    }else{
      return (
    <div> Correlation Coefficient: {this.state.corrCoef?this.state.corrCoef:<img src={gif} alt="" width="130px" height="50px"></img>} 
      <div>{this.state.tempArray1.map((a, i) => 
          <p key={i}>{a[1]}</p>
      )}</div>
    <div>{this.state.tempArray2.map((a, i) => 
          <p key={i}>{a[1]}</p>
      )}</div>
    </div> 
      )
    }
    
  };
}
