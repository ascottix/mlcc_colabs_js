/*
    Misc utilities
*/
import fs from 'fs';

// See: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function saveChartToFile(chart, filename) {
    fs.writeFileSync(filename, chart.canvas.exportToPPM());
}

export function getRandomInitialWeightOrBias() {
    return Math.random() / 10;
}

export function loadCsv(filename) {
    const csv = fs.readFileSync(filename, 'utf-8');
    const lines = csv.split(/[\n\r]+/).filter(line => line.length > 0);
    const header = lines.shift().split(',');
    const data = lines.map(line => line.split(',').map(s => { // Extract the individual values
        const v = Number(s);
        return isNaN(v) ? s : v; // Convert values to numbers if possible, otherwise keep string
    }).reduce((a, v, i) => ({ ...a, [header[i]]: v }), {})); // Convert array into object using names from the header

    return data;
}
