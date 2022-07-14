import React from 'react';
import axios from 'axios';
import gif from './big-blue-button-loading.gif'; // from https://tenor.com/view/big-blue-button-loading-meeting-waiting-typing-gif-17116389

export default class IndexComponent extends React.Component {
    constructor(props) {
        console.log("in IndexComp constructor");
          super(props);
          // declare the initial state
          this.state = {
            responseOne: '', prevClose1: 0,
            responseTwo: '', prevClose2: '',
            responseThree: '', prevClose3: '',
          };
      }
    componentDidMount() {
        // GET request to the URL
        const nasdaq_price = axios.get("https://api.twelvedata.com/time_series?symbol=ixic&interval=5min&apikey="+process.env.REACT_APP_INDEX_API_KEY);
        const dow_price = axios.get("https://api.twelvedata.com/time_series?symbol=dji&interval=5min&apikey="+process.env.REACT_APP_INDEX_API_KEY);
        const sp500_price = axios.get("https://api.twelvedata.com/time_series?symbol=spx&interval=5min&apikey="+process.env.REACT_APP_INDEX_API_KEY);
        
        axios.all([nasdaq_price, dow_price, sp500_price]).then(axios.spread((...responses) => {console.log(responses[0])
            const prevClose1 = responses[0].data.values[1].close; this.setState({prevClose1: prevClose1}) 
            const prevClose2 = responses[1].data.values[1].close; this.setState({prevClose2: prevClose2})
            const prevClose3 = responses[2].data.values[1].close; this.setState({prevClose3: prevClose3})
            // const responseThree = responses[2];
            this.setState({responseOne: responses[0].data.values[0].close, responseTwo: responses[1].data.values[0].close, responseThree: responses[2].data.values[0].close});
            if(prevClose1 > this.state.responseOne){

            }
        }));
    }

    render(){
        console.log("in IndexComp render");
        if(this.state.prevClose1===0){
          return (<img src={gif} alt="" width="180px" height="100px"></img>);
        }else{
          return (
            <div style={{display:"inline-block"}}>
            Dow: {this.state.prevClose2>this.state.responseTwo? <p style={{color:"red", display:"inline-block"}}>{this.state.responseTwo}</p>:<p style={{color:"green", display:"inline-block"}}>{this.state.responseTwo}</p>}  &emsp;
            S&amp;P500: {this.state.prevClose3>this.state.responseThree? <p style={{color:"red", display:"inline-block"}}>{this.state.responseThree}</p>: <p style={{color:"green", display:"inline-block"}}>{this.state.responseThree}</p>}  &emsp;
            Nasdaq: {this.state.prevClose1>this.state.responseOne? <p style={{color:"red", display:"inline-block"}}>{this.state.responseOne}</p>:<p style={{color:"green", display:"inline-block"}}>{this.state.responseOne}</p>} &emsp;
            </div>
          )
        }
        
      };

}