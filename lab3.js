// Analyze data and find outliers
// Copyright (c) 2024 Alessandro Scotti
// MIT License
import { computeFeatureStats, describeDataset } from './utils/stats.js';
import { loadCsv } from './utils/misc.js';

function findOutliers(dataset) {
    const features = Object.keys(dataset[0]);

    for(const feature of features) {
        const s = computeFeatureStats(dataset, feature);

        // The idea here is to compare the order of magnitude of the first and last quartile range
        const l25 = s.p25 - s.min;
        const h25 = s.max - s.p75;
        const logl25 = Math.log10(l25);
        const logh25 = Math.log10(h25);

        if(Math.floor(logl25) != Math.floor(logh25)) {
            console.log(`${Math.abs(logh25-logl25) < 1 ? 'Possible' : 'Likely'} outliers in: ${feature}`);
        }
    }
}

function main() {
    const dataset = loadCsv('data/california_housing_train.csv');

    describeDataset(dataset);
    findOutliers(dataset);
}

main();
