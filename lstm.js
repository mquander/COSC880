// borrowed code from: https://towardsdatascience.com/time-series-forecasting-with-tensorflow-js-1efd48ff2201 &
// https://github.com/jinglescode/time-series-forecasting-tensorflowjs
const tf = require('@tensorflow/tfjs-node');

function normalizeTensorFit(tensor) {
    const maxval = tensor.max();
    const minval = tensor.min();
    const normalizedTensor = normalizeTensor(tensor, maxval, minval);
    return [normalizedTensor, maxval, minval];
  }
function normalizeTensor(tensor, maxval, minval) {
    const normalizedTensor = tensor.sub(minval).div(maxval.sub(minval));
    return normalizedTensor;
}

function ComputeSMA(data, window_size){
    let r_avgs = [], avg_prev = 0;
    for (let i = 0; i <= data.length - window_size; i++){
      let curr_avg = 0.00, t = i + window_size;
      for (let k = i; k < t && k <= data.length; k++){
        curr_avg += data[k][1] / window_size;
      }
      r_avgs.push({ set: data.slice(i, i + window_size), avg: curr_avg }); //console.log(curr_avg);
      avg_prev = curr_avg; 
    }
    return r_avgs;
  }


async function trainModel(inputs, outputs, trainingsize, window_size, n_epochs, learning_rate, n_layers, callback){
    //console.log(trainingsize); console.log(window_size); console.log(n_epochs); console.log(learning_rate) ; console.log(n_layers)
    
    const batchSize = 32; //new
    const input_layer_shape  = Math.floor(window_size);
    //const input_layer_neurons = 100;
    const input_layer_neurons = 64; //new

    //const rnn_input_layer_features = 10;
    const rnn_input_layer_features = 16; // new
    const rnn_input_layer_timesteps = input_layer_neurons / rnn_input_layer_features;
  
    const rnn_input_shape  = [rnn_input_layer_features,  Math.floor(rnn_input_layer_timesteps)];
    //const rnn_output_neurons = 20;
    const rnn_output_neurons = 16; // new

    const rnn_batch_size = window_size;
  
    const output_layer_shape = rnn_output_neurons;
    const output_layer_neurons = 1;
  
    
    let X = inputs.slice(0, Math.floor(trainingsize / 100 * inputs.length));
    let Y = outputs.slice(0, Math.floor(trainingsize / 100 * outputs.length));
    //old way
    // const xs = tf.tensor2d(X, [X.length, X[0].length]).div(tf.scalar(10));
    // const ys = tf.tensor2d(Y, [Y.length, 1]).reshape([Y.length, 1]).div(tf.scalar(10));
    console.log(X)
    const inputTensor = tf.tensor2d(X, [X.length, X[0].length])
    const labelTensor = tf.tensor2d(Y, [Y.length, 1]).reshape([Y.length, 1])

    const [xs, inputMax, inputMin] = normalizeTensorFit(inputTensor)
    const [ys, labelMax, labelMin] = normalizeTensorFit(labelTensor)
    
    const model = tf.sequential();

    model.add(tf.layers.dense({units: input_layer_neurons, inputShape: [input_layer_shape]}));
    model.add(tf.layers.reshape({targetShape: rnn_input_shape})); //
  
    var lstm_cells = []; 
    for (let index = 0; index < n_layers; index++) {
         lstm_cells.push(tf.layers.lstmCell({units: rnn_output_neurons})); 
         
    }
   
    model.add(tf.layers.rnn({
      cell: lstm_cells,
      inputShape: rnn_input_shape,
      returnSequences: false
    }));
  
    model.add(tf.layers.dense({units: output_layer_neurons, inputShape: [output_layer_shape]}));
 
    model.compile({
      optimizer: tf.train.adam(learning_rate),
      loss: 'meanSquaredError'
    });
  
    const hist = await model.fit(xs, ys,
      { batchSize: batchSize, epochs: n_epochs
    //     , callbacks: {
    //     onEpochEnd: async (epoch, log) => {
    //       callback(epoch, log);
    //     }
    //   }
    });
  //console.log(hist); process.exit() 
    return { model: model, stats: hist, normalize: {inputMax:inputMax, inputMin:inputMin, labelMax:labelMax, labelMin:labelMin} };
  }

function makePredictions(X, model, dict_normalize){
    // const predictedResults = model.predict(tf.tensor2d(X, [X.length, X[0].length]).div(tf.scalar(10))).mul(10); // old method
    
    X = tf.tensor2d(X, [X.length, X[0].length]);
    const normalizedInput = normalizeTensor(X, dict_normalize["inputMax"], dict_normalize["inputMin"]);
    const model_out = model.predict(normalizedInput);
    const predictedResults = unNormalizeTensor(model_out, dict_normalize["labelMax"], dict_normalize["labelMin"]);

    return Array.from(predictedResults.dataSync());
}
function unNormalizeTensor(tensor, maxval, minval) {
    const unNormTensor = tensor.mul(maxval.sub(minval)).add(minval);
    return unNormTensor;
}
var inputs ;

async function lstm(inputArray){

    var sma_vec = []
    sma_vec = ComputeSMA(inputArray, inputArray.length/4)

    inputs = sma_vec.map(function(inp_f){
        return inp_f['set'].map(function(val) { return val[1]; })
    });

    var outputs = sma_vec.map(function(outp_f) { return outp_f['avg']; });

    var trainingsize = 70
    inputs = inputs.slice(0, Math.floor(trainingsize / 100 * inputs.length)); 
    outputs = outputs.slice(0, Math.floor(trainingsize / 100 * outputs.length)); //console.log(outputs);  process.exit()
    var n_epochs = 50, window_size = inputArray.length/4, learningrate = 0.01, n_hiddenlayers=4;


    var result = await trainModel(inputs, outputs, trainingsize, window_size, n_epochs, learningrate, n_hiddenlayers);
    //console.log("result:")
    //console.log(result)

    // validate on training
    var val_train_x = inputs.slice(0, Math.floor(trainingsize / 100 * inputs.length));
    var val_train_y = makePredictions(val_train_x, result['model'], result['normalize']);
    var val_unseen_x = inputs.slice(Math.floor(trainingsize / 100 * inputs.length), inputs.length);
    var val_unseen_y = makePredictions(val_unseen_x, result['model'], result['normalize']);

    var sma = sma_vec.map(function (val) { return val['avg']; });
    var prices = inputArray.map(function (val) { return val[1]; });
    sma = sma.slice(0, Math.floor(trainingsize / 100 * sma.length));

    var timestamps_a = inputArray.map(function (val) { return val[0]; });
    var timestamps_b = inputArray.map(function (val) {
        return val[0];
    }).splice(window_size, (inputArray.length - Math.floor((100-trainingsize) / 100 * inputArray.length)));
    var timestamps_c = inputArray.map(function (val) {
        return val[0];
    }).splice(window_size + Math.floor(trainingsize / 100 * inputs.length), inputs.length);

    console.log(timestamps_a); // for raw prices
    console.log(timestamps_b); // for SMA and Val_train_Y
    console.log(timestamps_c); // for Val_unseen_Y
    console.log(prices)
    console.log(sma)
    console.log(val_train_y)
    console.log(val_unseen_y)
    return({
        timestamps_a: timestamps_a, 
        timestamps_b: timestamps_b, 
        timestamps_c: timestamps_c, 
        prices: prices, 
        sma: sma, 
        val_train_y: val_train_y, 
        val_unseen_y: val_unseen_y
    })
}
//lstm();
var exportObjects = {lstm}
module.exports = exportObjects;