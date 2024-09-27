/*
    Statistical functions
*/
import { square } from './math.js';

export function computeFeatureStats(dataset, feat) {
    const data = dataset.map(v => v[feat]);

    // Expected value (mean)
    const mean = data.reduce((a, v) => a + v, 0) / data.length;

    // Variance, i.e. the expected value (mean) of the squared deviation from the mean
    const variance = data.reduce((a, v) => a + square(v - mean), 0) / data.length;

    // Standard deviation, i.e. the square root of the variance
    const std = Math.sqrt(variance);

    // Min and max
    const min = Math.min(...data);
    const max = Math.max(...data);

    // Return the statistics
    return {
        count,
        mean,
        std,
        min,
        max
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
