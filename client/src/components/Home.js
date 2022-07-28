import '../App.css';
import BasicComponent from '../BasicComponent';
import React from 'react';
import IndexComponent from '../IndexComponent';
import GraphComponent from '../GraphComponent';
import Watchlist from './Watchlist';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
//import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
//import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const theme = createTheme();
// import { useContext } from "react";
// import { useLocation, useNavigate } from "react-router";
// import { UserContext } from "../App";

export default class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      viewForm: false,
      cryptoVariable: '', cryptoInput: '', indexInput: '', fromDate: '', toDate: ''
    };
    //this.updateCryptoInput = this.updateCryptoInput.bind(this);;
    this.cryptoChange = this.cryptoChange.bind(this);
    this.indexChange = this.indexChange.bind(this);
    this.fromDateChange = this.fromDateChange.bind(this);
    this.toDateChange = this.toDateChange.bind(this);
    this.dateValidate = this.dateValidate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
//   updateCryptoInput(cryptoArg){
//     this.setState({cryptoInput: cryptoArg});
//   }
//   shouldComponentUpdate(){
//     this.setState({cryptoInput: this.props.cryptoInput});
//     this.setState({indexInput: this.props.indexInput});
//     console.log(this.props.cryptoInput)
//     return true;
//   }
  cryptoChange(event) {    
    this.setState({cryptoInput: event.target.value}); 
    this.setState({viewForm: false});  
  }
  indexChange(event) {    
    this.setState({indexInput: event.target.value}); 
    this.setState({viewForm: false});
  }
  fromDateChange(event) {    
    
    this.setState({fromDate: event.target.value}, () => {this.disableWeekendDate(); this.disableHolidays()});
    this.setState({viewForm: false});
  }
  toDateChange(event) {    
    this.setState({toDate: event.target.value}, () => {this.dateValidate(); this.disableWeekendDate(); this.disableHolidays()});
    this.setState({viewForm: false});
  }
  handleSubmit(event) {    
    event.preventDefault();
    const userData = new FormData(event.currentTarget);
    var searchParamsObj = {
        cryptoInputMUI: userData.get('cryptoInputMUI'),
        indexInputMUI: userData.get('indexInputMUI'),
        fromDateInputMUI: userData.get('fromDateInputMUI'),
        toDateInputMUI: userData.get('toDateInputMUI')
    }
    console.log(searchParamsObj);

    if(this.state.fromDate > this.state.toDate){
        this.setState({viewForm: false});
        alert("From date must be earlier than the To date");
        return false;
    }else if(!this.indexValidate()){
        this.setState({viewForm: false});
        this.setState({indexInput: ''})
        alert("Please pick a valid index")
        return false;
    }else if(!this.disableWeekendDate()){
        // enters here if weekend date selected
        this.setState({viewForm: false});
    }else if(!this.disableHolidays()){
        // enters here if holiday selected
        this.setState({viewForm: false});
    }else if(this.validateData()){
        //if all input data valid
        this.displayData();
    }


  }
  dateValidate(){
    if(this.state.fromDate > this.state.toDate){ //(this.state.fromDate !== '' && this.state.toDate !== '') && 
       this.setState({toDate: ''}, ()=>{this.setState({viewForm: false});});
        console.log("from: "+this.state.fromDate +" to: "+ this.state.toDate)
      alert("From date must be earlier than the To date");
      return false;
      //this.setState({fromDate: ''});
      
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
      return false
    }
    if(today === 0 || today === 6){
      this.setState({toDate: ''});
      alert("Please pick a week date");
      return false
    }
    return true;
    
  }
  disableHolidays(){
    var holidays = ["2022-07-04", "2022-06-20", "2022-05-30", "2022-04-15", "2022-02-21", "2022-01-17", "2021-12-24", "2021-11-25", "2021-09-06", "2021-07-05", "2021-05-31", "2021-04-02", "2021-02-15", "2021-01-18", "2021-01-01"];
    
    if(holidays.includes(this.state.fromDate)){
      this.setState({fromDate: ''});
      alert("Please pick a non-holiday from date");
      return false;
    }else if(holidays.includes(this.state.toDate)){
      this.setState({toDate: ''});
      alert("Please pick a non-holiday to date");
      return false;
    }
    return true;
  }
  //********************************************* */

//   updateVariable(cryptoVar){
//     this.setState({cryptoVariable: cryptoVar});
//   }
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
  }

  render(){
    
    console.log("in Home.js render: " + new Date());
    var componentRender = null//, watchlistComp = null;
    if(this.state.viewForm){
      componentRender = (<div style={{border: "1px solid white"}}><BasicComponent arg={this.state.cryptoInput} arg2={this.state.indexInput} arg3={this.state.fromDate} arg4={this.state.toDate}/></div>);
    }else{
      componentRender = (<div><GraphComponent/></div>)
    }
    return (
    
    <div className="App" >
      <header className="App-header">
        
       <div style={{border: "1px solid white"}}><IndexComponent/></div> {/**/}
      
      <div style={{maxWidth: "1000px"}}>Please enter a recognized cryptocurrency and one of the following sector indexes: "technology", "finance", "oil", "consumercyclicals", "healthcare","transportation", "vix", or "treasuries"</div>  &emsp;
      
        {/* put BasicComp/componentRender here, which contains GraphComp */}
        <Grid  container spacing={3}>
            <Grid item xs sx={{ alignItems: 'left', display: 'flex', justifyContent:"left" , minWidth: 260}}><Item>{<Watchlist/>}</Item></Grid>  {/* watchlistComp */}
            <Grid item xs sx={{alignItems: 'center', justifyContent:"center"}} elevation={3}><Item>{componentRender}</Item></Grid>
            <Grid item xs sx={{ alignItems: 'right', display: 'flex', justifyContent:"right" , minWidth: 260}}><Item></Item></Grid>
            {/* <Grid item xs><Item><Box sx={{ width: '100%', minWidth: 260}}></Box></Item></Grid> */}
        </Grid>
        <div>
          {/*<form onSubmit={this.handleSubmit}>
            <label>Crypto: <input type="text" value={this.state.cryptoInput} onChange={this.cryptoChange} required/></label>  &emsp;
            <label>Index: <input type="text" value={this.state.indexInput} onChange={this.indexChange} required/></label><br/><br/>
            <label>From: <input type="date" min="2021-01-01" max={new Date().toISOString().slice(0, 10)} value={this.state.fromDate} onChange={this.fromDateChange} required/></label> &emsp;
            <label>To: <input type="date" min="2021-01-01" max={new Date().toISOString().slice(0, 10)} value={this.state.toDate} onChange={this.toDateChange} required/></label><br/><br/>
            
          
            <button onClick={() => {this.validateData()? this.displayData(): this.setState({viewForm: false})}}>Submit</button> &emsp;
            <button onClick={() => {this.clear()}}>Clear</button>
          
          </form>  */}
          {/* <div>{this.state.viewForm? <BasicComponent arg={this.state.cryptoInput} arg2={this.state.indexInput}/>:''}  </div> */}    
        {/*  <input type="submit" value="Submit" onClick={() => {this.displayData();}}/>*/}
        </div>
    <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >

            <Box component="form" noValidate onSubmit={this.handleSubmit} sx={{ mt: 3 , input: { color: 'white' }, label: { color: 'white' } }}>
                <Grid container  spacing={{ xs: 3, md: 2 }}> 
                    <Grid item xs={12} sm={6} >
                        <TextField 
                        // onChange={(newValue) => {  rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} 
                        //     setValue(newValue.target.value);
                        // }}
                        onChange={this.cryptoChange}
                        sx={{border: 1, borderColor: 'primary', input: {invalid: {border: "2px red"} }}}
                        autoComplete=""
                        name="cryptoInputMUI"
                        required
                        id="cryptoInputMUI"
                        label="Crypto"
                        value={this.state.cryptoInput}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                        // onChange={(newValue) => {
                        //     setValue(newValue.target.value);
                        // }}
                        onChange={this.indexChange}
                        sx={{border: 1, borderColor: 'primary'}}
                        autoComplete=""
                        name="indexInputMUI"
                        required
                        id="indexInputMUI"
                        label="Index"
                        value={this.state.indexInput}
                        />
                    </Grid>
                    {/* <Grid item xs={12} sm={6} sx={{border: 1, borderColor: 'primary'}}>
                        <TextField 
                        // onChange={(newValue) => {
                        //     setValue(newValue.target.value);
                        // }}
                        onChange={this.fromDateChange}
                        sx={{border: 1, borderColor: 'primary'}}
                        autoComplete=""
                        type="date"
                        name="fromDateInputMUI"
                        required
                        id="fromDateInputMUI"
                        label="From Date"
                        autoFocus
                        value={this.state.fromDate}
                        />
                        
                    </Grid> */}
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            format="YYYY-MM-DD"
                            onChange={(newValue) => {this.setState({fromDate: new Date(newValue).toISOString().slice(0, 10)})}} // display: 'inline'
                            //onChange={this.fromDateChange}
                            autoComplete=""
                            name="fromDateInputMUI"
                            required
                            id="fromDateInputMUI"
                            label="From Date"
                            autoFocus
                            value={this.state.fromDate}
                            // onChange={(newValue) => {
                            // setValue(newValue);
                            // }}
                            
                            renderInput={(params) => <TextField {...params} />}
                        />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            format="YYYY-MM-DD"
                            onChange={(newValue) => {this.setState({toDate: new Date(newValue).toISOString().slice(0, 10)}, ()=>{this.dateValidate()}); }} //this.toDateChange display: 'inline'
                            autoComplete=""
                            name="toDateInputMUI"
                            required
                            id="toDateInputMUI"
                            label="To Date"
                            autoFocus
                            value={this.state.toDate}
                            // onChange={(newValue) => {
                            // setValue(newValue);
                            // }}
                            
                            renderInput={(params) => <TextField {...params} />}
                        />
                        </LocalizationProvider>
                    </Grid> {/* */}
                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 , mr: 3, ml: 2 }}
                    >
                    Submit
                </Button>
                <Button
                    onClick={() => {this.clear(); this.setState({fromDate: ''}); this.setState({toDate: ''})}}
                    variant="contained"
                    sx={{ mt: 3, mb: 2 , mr: 3, ml: 2 }}
                    >
                    Clear
                </Button>
            </Box>

        </Box>
        </Container>
    </ThemeProvider>
      </header>
    </div>
    
  );
  }
  
}

