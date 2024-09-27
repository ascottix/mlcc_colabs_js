// Linear regression taxi
// Copyright (c) 2024 Alessandro Scotti
// MIT License
import Chart from './utils/chart.js';
import { computeFeatureStats } from './utils/stats.js';
import { square } from './utils/math.js';
import { shuffle, getRandomInitialWeightOrBias, saveChartToFile, loadCsv } from './utils/misc.js';

function loadChicagoTaxiDataset() {
    return loadCsv('data/chicago_taxi_train.csv');
}

// This model predicts the FARE using only one feature,
// we choose TRIP_MILES because it correlates strongly with FARE
function runExperiment1(dataset, config) {
    const num_batches = Math.ceil(dataset.length / config.batch_size);
    const stats = [];

    // Initialize weight and bias with small random values
    let weight = getRandomInitialWeightOrBias();
    let bias = getRandomInitialWeightOrBias();

    // Train the model for the specified number of epochs
    for (let epoch = 1; epoch <= config.epochs; epoch++) {
        // It is VERY important to randomize the dataset, otherwise the model will NOT converge!
        shuffle(dataset);

        for (let batch_index = 0; batch_index < num_batches; batch_index++) {
            const example_index = batch_index * config.batch_size;
            const batch_size = Math.min(config.batch_size, dataset.length - example_index);

            let dloss_dw = 0;
            let dloss_db = 0;

            for (let i = 0; i < batch_size; i++) {
                const example = dataset[example_index + i];
                const trip_miles = example.TRIP_MILES;
                const fare = example.FARE;

                // Get the model prediction
                const predicted_fare = weight * trip_miles + bias;

                // Get the prediction error
                const error = predicted_fare - fare;

                // Update the gradient descent derivatives
                dloss_dw += error * trip_miles;
                dloss_db += error;
            }

            // Update the parameters according to gradient descent
            weight = weight - config.learning_rate * (2 * dloss_dw / batch_size);
            bias = bias - config.learning_rate * (2 * dloss_db / batch_size);
        }

        // Print stats
        const mse = dataset.reduce((a, v) => a + square(v.TRIP_MILES * weight + bias - v.FARE), 0) / dataset.length;
        const rmse = Math.sqrt(mse); // Root MSE is useful because it can be directly compared with the label

        stats.push(rmse);

        console.log(`Epoch ${epoch}/${config.epochs}, loss=${mse}, rmse=${rmse}`);
    }

    console.log(`Done. Weight = ${weight.toFixed(5)}, bias = ${bias.toFixed(5)}, predicted_fare = ${weight.toFixed(3)} * TRIP_MILES + ${bias.toFixed(3)}`);

    // Chart the loss curve: RMSE over Epoch
    const lossCurveChart = new Chart();
    const maxRmse = Math.max(...stats);
    const step = 1 / config.epochs;

    for (let epoch = 1; epoch < config.epochs; epoch++) {
        lossCurveChart.plotLine(step * (epoch - 1), stats[epoch - 1] / maxRmse, step * epoch, stats[epoch] / maxRmse);
    }

    lossCurveChart.plotAxis();
    saveChartToFile(lossCurveChart, 'lab1_loss_curve.ppm');

    // Chart the model plot: FARE over TRIP_MILES and the model curve (a line)
    const modelPlotChart = new Chart();

    const tripMilesStats = computeFeatureStats(dataset, 'TRIP_MILES');
    const fareStats = computeFeatureStats(dataset, 'FARE');
    const fareRange = fareStats.max - fareStats.min;

    for (const example of dataset) {
        const fare = (example.FARE - fareStats.min) / fareRange;
        const miles = (example.TRIP_MILES - tripMilesStats.min) / (tripMilesStats.max - tripMilesStats.min);

        modelPlotChart.plotSample(miles, fare);
    }

    const fare_min = (weight * tripMilesStats.min + bias) / fareRange;
    const fare_max = (weight * tripMilesStats.max + bias) / fareRange;
    modelPlotChart.plotLine(0, fare_min, 1, fare_max);

    modelPlotChart.plotAxis();
    saveChartToFile(modelPlotChart, 'lab1_model_plot.ppm');
}

// This model predicts the FARE using two features,
// we choose TRIP_MILES and TRIP_MINUTES because they correlates strongly with FARE.
// Note: we derive TRIP_MINUTES from TRIP_SECONDS. It's better to use TRIP_MINUTES
// because it's similar in magnitude to TRIP_MILES, which helps the model converge.
function runExperiment2(dataset, config) {
    const num_batches = Math.ceil(dataset.length / config.batch_size);

    // Initialize weights and bias with small random values
    let w_miles = getRandomInitialWeightOrBias();
    let w_mins = getRandomInitialWeightOrBias();
    let bias = getRandomInitialWeightOrBias();

    // Train the model for the specified number of epochs
    for (let epoch = 1; epoch <= config.epochs; epoch++) {
        shuffle(dataset);

        for (let batch_index = 0; batch_index < num_batches; batch_index++) {
            const example_index = batch_index * config.batch_size;
            const batch_size = Math.min(config.batch_size, dataset.length - example_index);

            let dloss_dw_miles = 0;
            let dloss_dw_mins = 0;
            let dloss_db = 0;

            for (let i = 0; i < batch_size; i++) {
                const example = dataset[example_index + i];
                const trip_miles = example.TRIP_MILES;
                const trip_mins = example.TRIP_SECONDS / 60;
                const fare = example.FARE;

                // Get the model prediction
                const predicted_fare = w_miles * trip_miles + w_mins * trip_mins + bias;

                // Get the prediction error
                const error = predicted_fare - fare;

                // Update the gradient descent derivatives
                dloss_dw_miles += error * trip_miles;
                dloss_dw_mins += error * trip_mins;
                dloss_db += error;
            }

            // Update the parameters according to gradient descent
            w_miles = w_miles - config.learning_rate * (2 * dloss_dw_miles / batch_size);
            w_mins = w_mins - config.learning_rate * (2 * dloss_dw_mins / batch_size);
            bias = bias - config.learning_rate * (2 * dloss_db / batch_size);
        }

        // Print stats
        const mse = dataset.reduce((a, v) => a + square(v.TRIP_MILES * w_miles + v.TRIP_SECONDS * w_mins / 60 + bias - v.FARE), 0) / dataset.length;
        const rmse = Math.sqrt(mse); // Root MSE is useful because it can be directly compared with the label

        console.log(`Epoch ${epoch}/${config.epochs}, loss=${mse}, rmse=${rmse}`);
    }

    console.log(`Done. Predicted_fare = ${w_miles.toFixed(2)} * TRIP_MILES + ${w_mins.toFixed(2)} * TRIP_MINUTES + ${bias.toFixed(2)}`);
}

function main() {
    const dataset = loadChicagoTaxiDataset();

    const config = {
        learning_rate: 0.001,
        epochs: 20,
        batch_size: 50
    }

    if (1) {
        runExperiment1(dataset, config); // One feature, also creates charts
    } else {
        runExperiment2(dataset, config); // Two features, no charts
    }
}

main();
