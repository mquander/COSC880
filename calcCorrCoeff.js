// borrowed from: https://www.geeksforgeeks.org/program-find-correlation-coefficient/
function correlationCoefficient(X2d, Y2d, n){
    var X = [], Y = [];
    for(var i = 0; i < X2d.length; i++){
        X.push(X2d[i][1]); // array X[] should only contain price, not date
        Y.push(Y2d[i][1]);
    }
    let sum_X = 0, sum_Y = 0, sum_XY = 0;
    let squareSum_X = 0, squareSum_Y = 0;
     
    for(let i = 0; i < n; i++){
        // Sum of elements of array X
        sum_X = sum_X + X[i];
        // Sum of elements of array Y.
        sum_Y = sum_Y + Y[i];
        // Sum of X[i] * Y[i].
        sum_XY = sum_XY + X[i] * Y[i];
        // Sum of square of array elements.
        squareSum_X = squareSum_X + X[i] * X[i];
        squareSum_Y = squareSum_Y + Y[i] * Y[i];
    }
     
    // Use formula for calculating correlation coefficient
    let corr = (n * sum_XY - sum_X * sum_Y)/
               (Math.sqrt((n * squareSum_X -
                       sum_X * sum_X) * 
                          (n * squareSum_Y - 
                       sum_Y * sum_Y)));
     
    return corr;
}

// Last Observation Carried Forward
function LOCF(arr1, arr2){
  //console.log(arr1); console.log(arr2);
  for(var i = 0, j=0; i < arr1.length; i++, j++){
      
      if(arr1[i][0] != arr2[j][0]){ 
          arr2.splice(j, 0, [arr1[i][0], arr2[j-1][1]]); // insert
          //console.log("inserted " + [arr1[i][0], arr2[j-1][1]])
      }
      if(j == arr2.length - 1 && j < arr1.length -1){//  console.log("j: " + j);last iteration (?)
          //arr2.splice(j, 0, [arr1[i][0], arr2[j-1][1]]);
          arr2.push([arr1[i+1][0], arr2[j][1]]);//i+1
          //console.log("pushed "+ [arr1[i+1][0], arr2[j][1]])
      }
      //console.log(arr1.length+": "+ arr1[i][0] + " " +arr2.length+": "+  arr2[i][0]); 
  }
}

// borrowed code from: https://medium.com/codex/calculating-the-exponential-moving-average-in-javascript-84dfea8d55cc
function calculateEMA(dataRaw, time_period) {
    var data = []
    dataRaw.forEach(element => {
      data.push(element[1])
    })
    const k = 2/(time_period + 1)
    var emaData = []
    emaData[0] = data[0]

    for (var i = 1; i < data.length; i++) {
        var newPoint = (data[i] * k) + (emaData[i-1] * (1-k))
        emaData.push(newPoint)
    }
    //var currentEma = [...emaData].pop()
    return emaData//+currentEma.toFixed(2)
  }

var exportObjects = {correlationCoefficient, LOCF, calculateEMA}
module.exports = exportObjects;