/*
    Canvas is a writable image that can be exported to PPM
*/
export default class Canvas {
    #canvas;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.canvas = [];
        for (let y = 0; y < height; y++) {
            const row = [];
            row.length = width;
            this.canvas.push(row.fill(0, 0, width));
        }
    }

    setPixel(x, y, rgb) {
        if (y >= 0 && x >= 0 && y < this.height && x < this.width) {
            this.canvas[y][x] = rgb;
        }
    }

    fill(rgb, sx, sy, ex, ey) {
        sx = sx || 0;
        sy = sy || 0;
        ex = ex || this.width;
        ey = ey || this.height;

        for (let y = sy; y < ey; y++) {
            for (let x = sx; x < ex; x++) {
                this.setPixel(x, y, rgb);
            }
        }
    }

    line(x0, y0, x1, y1, rgb, size) {
        size = size || 1;

        let dx = x1 - x0;
        let dy = y1 - y0;

        const step = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

        dx /= step;
        dy /= step;

        let x = x0, y = y0;

        for (let i = 0; i <= step; i++) {
            const px = Math.round(x), py = Math.round(y);
            this.fill(rgb, px, py, px + size, py + size);
            x += dx;
            y += dy;
        }
    }

    filledCircle(cx, cy, r, rgb) {
        for (let y = -r; y <= r; y++) {
            const x = Math.round(Math.sqrt(r * r - y * y));
            this.fill(rgb, cx - x, cy + y, cx + x + 1, cy + y + 1);
        }
    }

    circle(cx, cy, r, rgb) {
        let x = 0, y = r;
        let d = 3 - 2 * r;

        const draw = () => {
            this.setPixel(cx + x, cy + y, rgb);
            this.setPixel(cx - x, cy + y, rgb);
            this.setPixel(cx + x, cy - y, rgb);
            this.setPixel(cx - x, cy - y, rgb);
            this.setPixel(cx + y, cy + x, rgb);
            this.setPixel(cx - y, cy + x, rgb);
            this.setPixel(cx + y, cy - x, rgb);
            this.setPixel(cx - y, cy - x, rgb);
        }

        draw();

        while (y >= x) {
            if (d > 0) {
                y--;
                d = d + 4 * (x - y) + 10;
            }
            else {
                d = d + 4 * x + 6;
            }

            x++;

            draw();
        }
    }

    exportToPPM() {
        const ppm = [`P3 ${this.width} ${this.height} 255`];

        for (let y = 0; y < this.height; y++) {
            const row = this.canvas[y];
            const row_pixels = [];
            for (const rgb of row) {
                const r = (rgb >> 16) & 0xFF;
                const g = (rgb >> 8) & 0xFF;
                const b = (rgb) & 0xFF;
                row_pixels.push(r, g, b);
            }
            ppm.push(row_pixels.join(' '));
        }

        ppm.push('');

        return ppm.join('\n');
    }
}
