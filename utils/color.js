/*
    Color to RGB conversion with support for common color names
*/
const ColorNameToRgb = {
    'red': 0xFF0000,
    'green': 0x00FF00,
    'blue': 0x0000FF,
    'white': 0xFFFFFF,
    'black': 0x000000
}

export default function colorToRgb(color, defaultColor) {
    if(color == null) {
        color = defaultColor;
    }

    const rgb = ColorNameToRgb[color];

    return rgb != null ? rgb : color || 0;
}
