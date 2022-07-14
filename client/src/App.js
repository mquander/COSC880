import './App.css';
import BasicComponent from './BasicComponent';
import React from 'react';
import IndexComponent from './IndexComponent';


export default class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      viewForm: false,
      cryptoVariable: '', cryptoInput: '', indexInput: '', fromDate: '', toDate: ''
    };
    //this.state = {};
    this.cryptoChange = this.cryptoChange.bind(this);
    this.indexChange = this.indexChange.bind(this);
    this.fromDateChange = this.fromDateChange.bind(this);
    this.toDateChange = this.toDateChange.bind(this);
    this.dateValidate = this.dateValidate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  cryptoChange(event) {    
    this.setState({cryptoInput: event.target.value}); 
    this.setState({viewForm: false});  
  }
  indexChange(event) {    
    this.setState({indexInput: event.target.value}); 
    this.setState({viewForm: false});
  }
  fromDateChange(event) {    
    
    this.setState({fromDate: event.target.value}, () => {this.disableWeekendDate(); this.disableHolidays()}); // , () => {console.log("in fromDateChange, from: "+ this.state.fromDate)}
    
    this.setState({viewForm: false});
  }
  toDateChange(event) {    
    this.setState({toDate: event.target.value}, () => {this.dateValidate(); this.disableWeekendDate(); this.disableHolidays()});  //
    this.setState({viewForm: false});
  }
  handleSubmit(event) {    
    event.preventDefault();
  }
  dateValidate(){
    if(this.state.fromDate > this.state.toDate){ //(this.state.fromDate !== '' && this.state.toDate !== '') && 
      this.setState({viewForm: false}); console.log("from: "+this.state.fromDate +" to: "+ this.state.toDate)
      alert("From date must be earlier than the To date");
      //this.setState({fromDate: ''});
      this.setState({toDate: ''});
    }
  }
  indexValidate(){
    var validIndexes = ["technology", "finance", "oil", "consumercyclicals", "healthcare","transportation","vix", "treasuries"];
    if(!validIndexes.includes(this.state.indexInput)){
      this.setState({indexInput: ''})
      return false;
      //alert("Please pick a valid index")
    }
    else
      return true;
  }
  disableWeekendDate(){
    var fromday = (new Date(this.state.fromDate)).getUTCDay();
    var today = (new Date(this.state.toDate)).getUTCDay();
    console.log("fromDay: "+fromday)
    if(fromday === 0 || fromday === 6){
      this.setState({fromDate: ''});
      alert("Please pick a week date");
    }
    if(today === 0 || today === 6){
      this.setState({toDate: ''});
      alert("Please pick a week date");
    }
    
  }
  disableHolidays(){
    var holidays = ["2022-07-04", "2022-06-20", "2022-05-30", "2022-04-15", "2022-02-21", "2022-01-17", "2021-12-24", "2021-11-25", "2021-09-06", "2021-07-05", "2021-05-31", "2021-04-02", "2021-02-15", "2021-01-18", "2021-01-01"];
    
    if(holidays.includes(this.state.fromDate)){
      this.setState({fromDate: ''});
      alert("Please pick a non-holiday from date");
    }else if(holidays.includes(this.state.toDate)){
      this.setState({toDate: ''});
      alert("Please pick a non-holiday to date");
    }
  }
  //********************************************* */

  updateVariable(cryptoVar){
    this.setState({cryptoVariable: cryptoVar});
  }
  clear(){
    this.setState({viewForm: false});
    this.setState({cryptoInput: ''});
    this.setState({indexInput: ''});
    this.setState({fromDate: ''});
    this.setState({toDate: ''});
  }
  validateData(){
    if(this.state.cryptoInput !== '' && this.state.indexInput !== '' && this.state.fromDate !== '' && this.state.toDate !== ''){
      if(this.indexValidate())
        return true;
      else{
        alert("Please pick a valid index")
        return false;
      }
    }
    else{
      alert("missing input data")
      return false;
    }
      
  }
  displayData(){
    // if(this.state.cryptoInput !== '' && this.state.indexInput !== '' && this.state.fromDate !== '' && this.state.toDate !== ''){
       this.setState({viewForm: true}, () => {
            console.log("viewForm: "+this.state.viewForm+" cryptoInput: "+this.state.cryptoInput+" indexInput: "+this.state.indexInput+" fromDate: "+this.state.fromDate+" toDate: "+this.state.toDate)
        });
    // }else{
    //   this.setState({viewForm: false});
    // }
    // this.cryptoChange();
    // this.indexChange();
    // this.fromDateChange();
    // this.toDateChange();
    
  }

  render(){
    console.log("in App.js render: " + new Date());
    var componentRender = null;
    if(this.state.viewForm){
      componentRender = (<div><BasicComponent arg={this.state.cryptoInput} arg2={this.state.indexInput} arg3={this.state.fromDate} arg4={this.state.toDate}/></div>);
    }
    return (
    <div className="App">
      <header className="App-header">
      <div><IndexComponent/></div>  
      <div style={{maxWidth: "1000px"}}>Please enter one of the following sector indexes: "technology", "finance", "oil", "consumercyclicals", "healthcare","transportation", "vix", or "treasuries"</div>  &emsp;
      <div>Please enter a recognized cryptocurrency:</div>  &emsp;
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>Crypto: <input type="text" value={this.state.cryptoInput} onChange={this.cryptoChange} required/></label>  &emsp;
            <label>Index: <input type="text" value={this.state.indexInput} onChange={this.indexChange} required/></label><br/><br/>
            <label>From: <input type="date" min="2021-01-01" max={new Date().toISOString().slice(0, 10)} value={this.state.fromDate} onChange={this.fromDateChange} required/></label> &emsp;
            <label>To: <input type="date" min="2021-01-01" max={new Date().toISOString().slice(0, 10)} value={this.state.toDate} onChange={this.toDateChange} required/></label><br/><br/>

          {/*  <input type="submit" value="Submit" onClick={() => {this.displayData();}}/>*/}
            <button onClick={() => {this.validateData()? this.displayData(): this.setState({viewForm: false})}}>Submit2</button> &emsp;
            <button onClick={() => {this.clear()}}>Clear</button>
            {componentRender}
          {/* <div>{this.state.viewForm? <BasicComponent arg={this.state.cryptoInput} arg2={this.state.indexInput}/>:''}  </div> */}
          </form>
   
          {/* <form >
          <label for="crypto">Choose a Cryptocurrency:</label>
          <input type="text" id="crypto2" name="crypto2"/><br></br>
          
                  <button type="submit" onClick={() => {this.displayData(); console.log(crypto2); process.exit(); this.updateVariable(crypto)}}>Get Data</button>
 
          </form> */}
        
        
            {/*
            

              <label for="index">Choose a Sector Index:</label>

              <select name1="index" id="index">
                <option value2="technology">Technology</option>
                <option value2="finance">Finance</option>
                <option value2="oil">Oil</option>
              </select>
              
              <button type="submit" onClick={() => returnData}>Submit</button>
            </form>*/}
        </div>
      </header>
    </div>
  );
  }
  
}

