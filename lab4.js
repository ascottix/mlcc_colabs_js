// Analyze and find bad data
// Copyright (c) 2024 Alessandro Scotti
// MIT License
import Chart from './utils/chart.js';
import { computeFeatureStats, describeDataset } from './utils/stats.js';
import { loadCsv, saveChartToFile } from './utils/misc.js';

function createScatterChart(dataset, suffix, start, end) {
    const feat1 = 'calories';
    const feat2 = 'test_score';
    const chart = new Chart();

    const feat1Stats = computeFeatureStats(dataset, feat1);
    const feat2Stats = computeFeatureStats(dataset, feat2);

    chart.drawGrid(4, 6);

    start = start || 0;
    end = end || dataset.length;

    for (let i=start; i<end; i++) {
        const example = dataset[i];

        const x = (example[feat1] - feat1Stats.min) / (feat1Stats.max - feat1Stats.min);
        const y = (example[feat2] - feat2Stats.min) / (feat2Stats.max - feat2Stats.min);

        chart.plotSample(x, y, 'blue');
    }

    chart.drawAxis();

    saveChartToFile(chart, `lab4_${feat1}_vs_${feat2}${suffix || ''}.ppm`);
}

function main() {
    const dataset = loadCsv('data/lab4.csv');

    describeDataset(dataset);
    createScatterChart(dataset);

    // Describe weekly datasets
    for(let week=0; week<4; week++) {
        console.log(`=== Week #${week}`);
        const idx = week * 350;
        describeDataset(dataset.slice(idx, idx+349));
    }

    // Plot daily datasets
    // (the scale is the same for each chart, it makes it very easy to spot the bad day)
    for(let weekday=0; weekday<7; weekday++) {
        const idx = weekday*50;
        createScatterChart(dataset, `_day${weekday}`, idx, idx+50);
    }

    // Describe the bad day, and 2 days after for comparison
    const bad = 4;
    console.log(`=== Stats for day ${bad}, day ${bad+1}, day ${bad+2}`);
    const idx = bad * 50;
    describeDataset(dataset.slice(idx, idx+50));
    describeDataset(dataset.slice(idx+50, idx+100));
    describeDataset(dataset.slice(idx+100, idx+150));
}

main();
