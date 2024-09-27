/*
    Math functions
*/
export function square(x) {
    return x * x;
}

// Vector dot product
export function dot(v1, v2) {
    return v1.reduce((a, v, i) => a + v*v2[i], 0);
}

export function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
}
