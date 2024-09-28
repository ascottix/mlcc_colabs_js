/*
    Very simple charting
*/
import Canvas from './canvas.js';
import colorToRgb from './color.js';

const DefaultWidth = 240;
const DefaultHeight = 240;
const DefaultMargin = 8;

// In plotXyz() functions, input coordinates are normalized between 0 and 1, origin is in the lower left corner
export default class Chart {
    constructor(width, height, margin) {
        this.width = width || DefaultWidth;
        this.height = height || DefaultHeight;
        this.margin = margin != null ? margin : DefaultMargin;

        this.canvas = new Canvas(this.width + 2 * this.margin, this.height + 2 * this.margin);
        this.canvas.fill(colorToRgb('white'));
    }

    plotSample(x, y, rgb) {
        const cx = Math.floor(x * this.width);
        const cy = Math.floor((1 - y) * this.height);

        this.canvas.circle(this.margin + cx, this.margin + cy, 1, colorToRgb(rgb, 'blue'));
    }

    plotLine(x1, y1, x2, y2, rgb, thickness) {
        x1 = this.margin + Math.floor(x1 * this.width);
        y1 = this.margin + Math.floor((1 - y1) * this.height);
        x2 = this.margin + Math.floor(x2 * this.width);
        y2 = this.margin + Math.floor((1 - y2) * this.height);

        this.canvas.line(x1, y1, x2, y2, colorToRgb(rgb, 'red'), thickness || 2);
    }

    drawAxis() {
        const ey = this.canvas.height - this.margin;

        this.canvas.line(this.margin, this.margin, this.margin, ey, 0);
        this.canvas.line(this.margin, ey, this.canvas.width - this.margin, ey, 0);
    }

    drawGrid(cols, rows) {
        const dx = 1 / cols;
        const dy = 1 / rows;
        const c = 0xcccccc;

        for (let x = 0; x <= 1; x += dx) {
            this.plotLine(x, 0, x, 1, c, 1);
        }

        for (let y = 0; y <= 1; y += dy) {
            this.plotLine(0, y, 1, y, c, 1);
        }
    }
}
