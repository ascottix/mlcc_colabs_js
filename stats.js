/*
    Statistical functions
*/
import { square } from './math.js';

export function average(data) {
    return data.reduce((a, v) => a + v, 0) / data.length;
}

export function computeFeatureStats(dataset, feat) {
    const data = dataset.map(v => v[feat]);
    const count = data.length;

    // Expected value (mean)
    const mean = average(data);

    // Variance, i.e. the expected value (mean) of the squared deviation from the mean
    const variance = data.reduce((a, v) => a + square(v - mean), 0) / count;

    // Standard deviation, i.e. the square root of the variance
    const std = Math.sqrt(variance);

    // Sort the data to compute min, max and the quartiles
    data.sort((a, b) => a - b); // sort() by default uses alphabetical order, not numeric

    function pct(pos) {
        const idx = pos * (count - 1);
        const lo = Math.floor(idx);
        const hi = Math.ceil(idx);
        const frac = idx - lo;
        return data[lo] + (data[hi] - data[lo]) * frac;
    }

    // Return the statistics
    return {
        count,
        mean,
        std,
        min: data[0],
        p25: pct(0.25),
        p50: pct(0.50),
        p75: pct(0.75),
        max: data[count - 1]
    }
}

// Computes the Pearson correlation coefficient between two features
export function computeCorrelationCoefficient(dataset, feat1, feat2) {
    const f1_stats = computeFeatureStats(dataset, feat1);
    const f2_stats = computeFeatureStats(dataset, feat2);

    // Compute the covariance of the two features, i.e. the expected value (average) of
    // the product of their deviations from their respective mean
    const cov = dataset.reduce((a, v) => a + (v[feat1] - f1_stats.mean) * (v[feat2] - f2_stats.mean), 0) / dataset.length;

    // Compute the correlation coefficient
    const corr = cov / (f1_stats.std * f2_stats.std);

    return corr;
}

export function describeDataset(dataset) {
    const features = Object.keys(dataset[0]);

    const f = x => Number(x).toFixed(1);

    for(const feature of features) {
        const s = computeFeatureStats(dataset, feature);

        console.log(`${feature}: count=${s.count}, mean=${f(s.mean)}, std=${f(s.std)}, min=${f(s.min)}, p25=${f(s.p25)}, p50=${f(s.p50)}, p75=${f(s.p75)}, max=${f(s.max)}`);
    }
}
