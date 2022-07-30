import React from 'react';
//import { Component } from "react";
import CanvasJSReact from './canvasjs.stock.react';

//var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

export default class GraphComponent extends React.Component{
    constructor(props) {
        console.log("in GraphComp constructor");
          super(props);
          // declare the initial state
          // this.state = {
          //   cryptoArray: [], indexArray: [], displayRaw: true, displayScaled: false
          // };
    }

    // componentDidMount(){console.log("in componentDidMount GraphComp")
        
    //       this.setState({cryptoArray : this.props.cryptoArray});
    //       this.setState({indexArray : this.props.indexArray});
        
    // }
    // shouldComponentUpdate(nextprops){console.log("in shouldComponentUpdate GraphComp")
        
    //     if(nextprops.cryptoArray !== this.props.cryptoArray || nextprops.indexArray !== this.props.indexArray){
    //       this.setState({cryptoArray : nextprops.cryptoArray});
    //       this.setState({indexArray : nextprops.indexArray});
    //       this.setState({displayRaw : !this.props.displayRaw});
    //       this.setState({displayScaled : !this.props.displayScaled});
    //       return true;
    //     }
          
    //     else
    //       return false;
    // }
    render(){
      
        const options = {
            theme: "dark2",
            title: {
                text: "Crypto-Index Chart"
            },      
            charts: [{
              
              data: [
                {
                type: "line", showInLegend: true, name: "series1", legendText: "Crypto",
                dataPoints: [
                    // { x: new Date("2018-01-01"), y: 71 }
                    
                ]
                }, {
                type: "line", showInLegend: true, name: "series2", legendText: "Index",
                dataPoints: [
                    // { x: new Date("2018-01-01"), y: 71 }
                ]
                },
                {
                type: "line", showInLegend: true, name: "series3", legendText: "",
                dataPoints: [
                    // { x: new Date("2018-01-01"), y: 71 } - LinReg line
                    // { x: new Date("2022-05-03"), y: 100 },
                    // { x: new Date("2022-07-08"), y: 56.52924114383896 }
                ]
                }],
             axisX: {
              title: "Date",
              crosshair: {
                enabled: true,
                snapToDataPoint: true,
                valueFormatString: "MMM DD YYYY"
              }
            },
            axisY: {
              title: "Price",
              //prefix: "$",
              crosshair: {
                enabled: true,
                snapToDataPoint: true,
                valueFormatString: "#,###.##"
              }
            }
          }],
          navigator: {
            slider: {
            //   minimum: new Date("2018-07-01"),
            //   maximum: new Date("2019-06-30")
            }
          }
        };

        const containerProps = {
          width: "600px",
          height: "350px",
          margin: "auto"
        };
        if(typeof this.props.display === "undefined"){ //(typeof this.props.cryptoArray === "undefined" ||  this.props.cryptoArray === null) && (typeof this.props.indexArray === "undefined" ||  this.props.indexArray === null)
            console.log("1st if, display = undefined: "+this.props.display)
            
        //}else if(this.props.cryptoArray.length === 0 || this.props.indexArray.length ===0){
            //console.log("2nd if, cryptoArray.length === 0: "+this.props.cryptoArray)
        }else{
            console.log("else cryptoArray: "+this.props.cryptoArray)
            
            if(this.props.display === 'displayRaw'){

              for(var i=0; i < this.props.cryptoArray.length; i++){ //populate the chart
                options.charts[0].data[0].dataPoints.push({x: new Date(this.props.cryptoArray[i][0]), y: this.props.cryptoArray[i][1]}); 
                options.charts[0].data[1].dataPoints.push({x: new Date(this.props.indexArray[i][0]), y: this.props.indexArray[i][1]})
              }
              options.navigator.slider.minimum = new Date(this.props.cryptoArray[0][0])
              options.navigator.slider.maximum = new Date(this.props.cryptoArray[this.props.cryptoArray.length-1][0])

              options.charts[0].data[0].legendText = this.props.cryptoToSearch; 
              options.charts[0].data[1].legendText = this.props.indexToSearch;

            }else if(this.props.display === 'displayScaled'){

              for( i=0; i < this.props.cryptoArray.length; i++){ //populate the chart
                options.charts[0].data[0].dataPoints.push({x: new Date(this.props.cryptoArray[i][0]), y: this.props.cryptoArray[i][1]}); 
                options.charts[0].data[1].dataPoints.push({x: new Date(this.props.indexArray[i][0]), y: this.props.indexArray[i][1]})
              }
              options.navigator.slider.minimum = new Date(this.props.cryptoArray[0][0])
              options.navigator.slider.maximum = new Date(this.props.cryptoArray[this.props.cryptoArray.length-1][0])

              options.charts[0].data[0].legendText = this.props.cryptoToSearch; 
              options.charts[0].data[1].legendText = this.props.indexToSearch;

            }else if(this.props.display === 'displayCryptoLR'){

              for( i=0; i < this.props.cryptoArray.length; i++){ //populate the chart
                options.charts[0].data[0].dataPoints.push({x: new Date(this.props.cryptoArray[i][0]), y: this.props.cryptoArray[i][1]}); 
                //options.charts[0].data[1].dataPoints.push({x: new Date(this.props.coinRegLine[i][0]), y: this.props.coinRegLine[i][1]})
              }
              options.charts[0].data[1].dataPoints.push({x: new Date(this.props.cryptoArray[0][0]), y: this.props.coinRegLine.b});
              options.charts[0].data[1].dataPoints.push({x: new Date(this.props.cryptoArray[this.props.cryptoArray.length-1][0]), y: (this.props.coinRegLine.m *((this.props.cryptoArray.length-1)) + this.props.coinRegLine.b)});
              
              options.charts[0].data[0].legendText = this.props.cryptoToSearch;
              options.charts[0].data[1].legendText = "Regression Line"
              options.charts[0].data[1].color = 'red'

              options.navigator.slider.minimum = new Date(this.props.cryptoArray[0][0])
              options.navigator.slider.maximum = new Date(this.props.cryptoArray[this.props.cryptoArray.length-1][0])

            }else if(this.props.display === 'displayIndexLR'){

              for( i=0; i < this.props.indexArray.length; i++){ //populate the chart
                options.charts[0].data[0].dataPoints.push({x: new Date(this.props.indexArray[i][0]), y: this.props.indexArray[i][1]}); 
                //options.charts[0].data[1].dataPoints.push({x: new Date(this.props.coinRegLine[i][0]), y: this.props.coinRegLine[i][1]})
              }
              options.charts[0].data[1].dataPoints.push({x: new Date(this.props.indexArray[0][0]), y: this.props.indexRegLine.b});
              options.charts[0].data[1].dataPoints.push({x: new Date(this.props.indexArray[this.props.indexArray.length-1][0]), y: (this.props.indexRegLine.m *((this.props.indexArray.length-1)) + this.props.indexRegLine.b)});
              
              options.charts[0].data[0].legendText = this.props.indexToSearch;
              options.charts[0].data[1].legendText = "Regression Line"
              options.charts[0].data[1].color = 'red'

              options.navigator.slider.minimum = new Date(this.props.indexArray[0][0])
              options.navigator.slider.maximum = new Date(this.props.indexArray[this.props.indexArray.length-1][0])

            }else if(this.props.display === 'displayCryptoEMA'){

              for( i=0; i < this.props.cryptoArray.length; i++){ //populate the chart
                options.charts[0].data[0].dataPoints.push({x: new Date(this.props.cryptoArray[i][0]), y: this.props.cryptoArray[i][1]});
                options.charts[0].data[1].dataPoints.push({x: new Date(this.props.cryptoArray[i][0]), y: this.props.coinEMA[i]});
              }
              options.charts[0].data[0].legendText = this.props.cryptoToSearch;
              options.charts[0].data[1].legendText = this.props.cryptoToSearch+" EMA"
              options.charts[0].data[1].color = 'red'

              options.navigator.slider.minimum = new Date(this.props.cryptoArray[0][0])
              options.navigator.slider.maximum = new Date(this.props.cryptoArray[this.props.cryptoArray.length-1][0])

            }else if(this.props.display === 'displayIndexEMA'){

              for( i=0; i < this.props.indexArray.length; i++){ //populate the chart
                options.charts[0].data[0].dataPoints.push({x: new Date(this.props.indexArray[i][0]), y: this.props.indexArray[i][1]});
                options.charts[0].data[1].dataPoints.push({x: new Date(this.props.indexArray[i][0]), y: this.props.indexEMA[i]});
              }
              options.charts[0].data[0].legendText = this.props.indexToSearch;
              options.charts[0].data[1].legendText = this.props.indexToSearch+" EMA"
              options.charts[0].data[1].color = 'red'
              
              options.navigator.slider.minimum = new Date(this.props.indexArray[0][0])
              options.navigator.slider.maximum = new Date(this.props.indexArray[this.props.indexArray.length-1][0])

            }else if(this.props.display === 'displayIndexLSTM'){
              //var j;
              for( i=0; i < this.props.indexLSTM.timestamps_a.length; i++){ //raw data line
                options.charts[0].data[0].dataPoints.push({x: new Date(this.props.indexLSTM.timestamps_a[i]), y: this.props.indexLSTM.prices[i]});
              }
              for( i=0; i < this.props.indexLSTM.timestamps_b.length; i++){ //val train y data line
                //options.charts[0].data[1].dataPoints.push({x: new Date(this.props.indexLSTM.timestamps_b[i]), }) // for SMA
                if(i % 2 === 0){
                  options.charts[0].data[1].dataPoints.push({x: new Date(this.props.indexLSTM.timestamps_b[i]), y: this.props.indexLSTM.val_train_y[i/2]})// for Val_train_Y
                }
              }
              var timestamps_c = this.props.indexLSTM.timestamps_c.slice(this.props.indexLSTM.timestamps_c.length - this.props.indexLSTM.val_unseen_y.length, this.props.indexLSTM.timestamps_c.length - 1)
              for( i=0; i < timestamps_c.length; i++){
                //if(i % 2 === 0){
                options.charts[0].data[2].dataPoints.push({x: new Date(timestamps_c[i]), y: this.props.indexLSTM.val_unseen_y[i]}) // for Val_unseen_Y

                //}
              }
              options.charts[0].data[0].legendText= this.props.indexToSearch;
              options.charts[0].data[1].legendText= "Predicted (training set)";
              options.charts[0].data[2].legendText= "Predicted (test set)";
            }
            // for(var i=0; i < this.props.cryptoArray.length; i++){ //populate the chart
            //     options.charts[0].data[0].dataPoints.push({x: new Date(this.props.cryptoArray[i][0]), y: this.props.cryptoArray[i][1]}); 
            //     options.charts[0].data[1].dataPoints.push({x: new Date(this.props.indexArray[i][0]), y: this.props.indexArray[i][1]})
            // }
            // below for regression line
            //options.charts[0].data[2].dataPoints.push({x: new Date(this.props.cryptoArray[0][0]), y: this.props.coinRegLine.b});
            //options.charts[0].data[2].dataPoints.push({x: new Date(this.props.cryptoArray[this.props.cryptoArray.length-1][0]), y: (this.props.coinRegLine.m *((this.props.cryptoArray.length-1)) + this.props.coinRegLine.b)});
            
            // if(this.props.cryptoArray[0][1] === 100){ //if data is scaled
            //   options.charts[0].data[2].dataPoints.push({x: new Date(this.props.cryptoArray[0][0]), y: this.props.scaledCoinRegLine.b});
            //   options.charts[0].data[2].dataPoints.push({x: new Date(this.props.cryptoArray[this.props.cryptoArray.length-1][0]), y: (this.props.scaledCoinRegLine.m *((this.props.cryptoArray.length-1)) + this.props.scaledCoinRegLine.b)});
            // }
            
            
        }
        
        return (
            <div style={{border: "1px solid white"}}>
              <CanvasJSStockChart
                options={options}
                containerProps = {containerProps}
                onRef={ref => this.stockChart = ref}
              />
            </div>
          );
    }
}