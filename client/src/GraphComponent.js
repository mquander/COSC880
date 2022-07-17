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
          this.state = {
            cryptoArray: [], indexArray: []
          };
    }

    componentDidMount(){
        this.setState({cryptoArray : this.props.cryptoArray});
        this.setState({indexArray : this.props.indexArray});
    }
    render(){
        const options = {
            theme: "dark2",
            title: {
                text: "Crypto-Index Chart"
            },      
            charts: [{
              data: [{
                type: "line",
                dataPoints: [
                    // { x: new Date("2018-01-01"), y: 71 }
                ]
             }, {
                type: "line",
                dataPoints: [
                    // { x: new Date("2018-01-01"), y: 71 }
                ]
             }]
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
        if(typeof this.state.cryptoArray === "undefined"){ 
            console.log("1st if cryptoArray: "+this.state.cryptoArray)
            
        }else if(this.state.cryptoArray.length === 0){
            console.log("2nd if cryptoArray: "+this.state.cryptoArray)
        }else{
            console.log("else cryptoArray: "+this.state.cryptoArray)
            
            for(var i=0; i < this.state.cryptoArray.length; i++){
                options.charts[0].data[0].dataPoints.push({x: new Date(this.state.cryptoArray[i][0]), y: this.state.cryptoArray[i][1]})
                options.charts[0].data[1].dataPoints.push({x: new Date(this.state.indexArray[i][0]), y: this.state.indexArray[i][1]})
            }
            console.log("options.charts[0].data[0].dataPoints[0]: "+options.charts[0].data[0].dataPoints[0].x)
            console.log("options.charts[0].data[1].dataPoints[0]: "+options.charts[0].data[1].dataPoints[0].y)
            // this.state.cryptoArray.map((a, i) => (console.log({x: a[i][0], y: a[i][1]})
            //     options.charts.data.dataPoints.push({x: a[i][0], y: a[i][1]})
            //     options.charts[0].data[0].dataPoints.push({x: a[i][0], y: a[i][1]})
            // ))
            options.navigator.slider.minimum = new Date(this.state.cryptoArray[0][0])
            options.navigator.slider.maximum = new Date(this.state.cryptoArray[this.state.cryptoArray.length-1][0])
            console.log(options.navigator.slider.minimum)

        }
        
        return (
            <div>
              <CanvasJSStockChart
                options={options}
                containerProps = {containerProps}
                onRef={ref => this.stockChart = ref}
              />
            </div>
          );
    }
}