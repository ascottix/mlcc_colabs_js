// Turkish rice classification
// Copyright (c) 2024 Alessandro Scotti
// MIT License
import Chart from './utils/chart.js';
import { computeFeatureStats } from './utils/stats.js';
import { dot, sigmoid } from './utils/math.js';
import { shuffle, getRandomInitialWeightOrBias, saveChartToFile, loadCsv } from './utils/misc.js';

function createScatterChart(dataset, feat1, feat2) {
    const chart = new Chart(512, 256);

    chart.fillPlotArea(0xe5ecf6);
    chart.drawGrid(4, 8, 'white');

    const feat1Stats = computeFeatureStats(dataset, feat1);
    const feat2Stats = computeFeatureStats(dataset, feat2);

    for (const example of dataset) {
        const x = (example[feat1] - feat1Stats.min) / (feat1Stats.max - feat1Stats.min);
        const y = (example[feat2] - feat2Stats.min) / (feat2Stats.max - feat2Stats.min);

        chart.plotSample(x*0.9+0.05, y*0.9+0.05, example.Class == 'Cammeo' ? 0x636dfa : 0xef563b, 2);
    }

    chart.drawAxis();

    saveChartToFile(chart, `lab2_${feat1}_vs_${feat2}.ppm`);
}

function analyzeDataset(dataset) {
    const majAxisStats = computeFeatureStats(dataset, 'Major_Axis_Length');
    const areaStats = computeFeatureStats(dataset, 'Area');
    const perimStats = computeFeatureStats(dataset, 'Perimeter');
    const perimMaxFromMeanInStd = (perimStats.max - perimStats.mean) / perimStats.std;

    const f = (x) => Number(x).toFixed(1);

    console.log(`The shortest grain is ${f(majAxisStats.min)}px long, while the longest is ${f(majAxisStats)}px.`);
    console.log(`The smallest rice grain has an area of ${areaStats.min}px, while the largest has an area of ${areaStats.max}px.`);
    console.log(`The largest rice grain, with a perimeter of ${f(perimStats.max)}px, is ~${f(perimMaxFromMeanInStd)} standard deviations (${f(perimStats.std)}) from the mean (${f(perimStats.mean)}px).`);

    // Save charts
    createScatterChart(dataset, 'Area', 'Eccentricity');
    createScatterChart(dataset, 'Convex_Area', 'Perimeter');
    createScatterChart(dataset, 'Major_Axis_Length', 'Minor_Axis_Length');
    createScatterChart(dataset, 'Perimeter', 'Extent');
    createScatterChart(dataset, 'Eccentricity', 'Major_Axis_Length');
}

function normalizeDataset(dataset) {
    function normalize(feat) {
        const stats = computeFeatureStats(dataset, feat);

        for (const example of dataset) {
            const zscore = (example[feat] - stats.mean) / stats.std;

            example[feat] = zscore;
        }
    }

    const sample = dataset[0];

    for (const feat in sample) {
        if (typeof sample[feat] == 'number') {
            normalize(feat);
        }
    }

    for (const example of dataset) {
        example['Class_Bool'] = example.Class == 'Cammeo' ? 1 : 0;
    }
}

function runExperiment1(dataset, config) {
    const num_batches = Math.ceil(dataset.length / config.batch_size);

    const features = ['Eccentricity', 'Major_Axis_Length', 'Area'];
    const label = 'Class_Bool';

    // Initialize weights and bias with small random values
    const weights = features.map(() => getRandomInitialWeightOrBias());
    let bias = getRandomInitialWeightOrBias();

    const dl_dweights = weights.map(() => 0);

    // Train the model for the specified number of epochs
    for (let epoch = 1; epoch <= config.epochs; epoch++) {
        shuffle(dataset);

        for (let batch_index = 0; batch_index < num_batches; batch_index++) {
            const example_index = batch_index * config.batch_size;
            const batch_size = Math.min(config.batch_size, dataset.length - example_index);

            dl_dweights.fill(0);
            let dl_dbias = 0;

            for (let i = 0; i < batch_size; i++) {
                const example = dataset[example_index + i];

                const feature_values = features.map(f => example[f]);
                const label_value = example[label];

                // Get the model prediction
                const predicted_value = sigmoid(dot(weights, feature_values) + bias);

                // Get the prediction error
                const error = predicted_value - label_value;

                // Update the gradient descent derivatives
                for (let i = 0; i < dl_dweights.length; i++) {
                    dl_dweights[i] += error * feature_values[i];
                }
                dl_dbias += error;
            }

            // Update the parameters according to gradient descent
            // Note: we don't divide by the batch size
            for (let i = 0; i < weights.length; i++) {
                weights[i] -= config.learning_rate * dl_dweights[i];
            }
            bias = bias - config.learning_rate * dl_dbias;
        }

        // Print stats
        let loss = 0;
        let tp = 0, fp = 0, tn = 0, fn = 0;

        for (const example of dataset) {
            const feature_values = features.map(f => example[f]);
            const linear_value = dot(weights, feature_values) + bias;
            const predicted_value = sigmoid(linear_value);
            const label_value = example[label];
            const classification = predicted_value > config.classification_threshold ? 1 : 0;

            // Update the true/false positive/negative counts
            if (classification == label_value) {
                if (classification == 1) {
                    tp++;
                } else {
                    tn++;
                }
            } else {
                if (classification == 1) {
                    fp++;
                } else {
                    fn++;
                }
            }

            // Update the loss
            loss += -label_value * Math.log(predicted_value) - (1 - label_value) * Math.log(1 - predicted_value);
        }

        loss /= (tp + tn + fp + fn);  // tp + tn + fp + fn = length of the dataset

        const accuracy = (tp + tn) / (tp + tn + fp + fn);
        const precision = tp / (tp + fp);
        const recall = tp / (tp + fn);

        console.log(`Epoch ${epoch}/${config.epochs}, accuracy=${accuracy.toFixed(4)} - loss=${loss.toFixed(4)} - precision=${precision.toFixed(4)} - recall=${recall.toFixed(4)}`);
    }

    console.log('Weights:', weights, ', bias', bias);
}

function main() {
    const dataset = loadCsv('data/Rice_Cammeo_Osmancik.csv');

    const config = {
        learning_rate: 0.001,
        epochs: 60,
        batch_size: 100,
        classification_threshold: 0.35
    }

    analyzeDataset(dataset); // Will generate several charts
    normalizeDataset(dataset);
    const number_samples = dataset.length;
    const index_80th = Math.round(number_samples * 0.8);
    const index_90th = index_80th + Math.round(number_samples * 0.1);
    shuffle(dataset);
    const train_data = dataset.slice(0, index_80th); // Used for training
    const validation_data = dataset.slice(index_80th, index_90th); // Used for validation during training (not used here)
    const test_data = dataset.slice(index_90th); // Used for testing
    runExperiment1(train_data, config, test_data);
}

main();
