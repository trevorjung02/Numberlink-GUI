const colorList = [
    "black",
    "midnightblue",
    "darkgreen",
    "darkgoldenrod",
    "mediumturquoise",
    "red",
    "yellow",
    "mediumspringgreen",
    "blue",
    "lime",
    "fuchsia",
    "dodgerblue",
    "salmon",
    "plum",
    "deeppink",
    "wheat",
    "orange"
]

function getLightness(rgb) {
    const vR = parseInt(rgb.substring(1, 3), 16) / 255;
    const vG = parseInt(rgb.substring(3, 5), 16) / 255;
    const vB = parseInt(rgb.substring(5, 7), 16) / 255;
    const Y = (0.2126 * sRGBtoLin(vR) + 0.7152 * sRGBtoLin(vG) + 0.0722 * sRGBtoLin(vB));
    return YtoLstar(Y);

    function sRGBtoLin(colorChannel) {
        // Send this function a decimal sRGB gamma encoded color value
        // between 0.0 and 1.0, and it returns a linearized value.

        if (colorChannel <= 0.04045) {
            return colorChannel / 12.92;
        } else {
            return Math.pow(((colorChannel + 0.055) / 1.055), 2.4);
        }
    }

    function YtoLstar(Y) {
        // Send this function a luminance value between 0.0 and 1.0,
        // and it returns L* which is "perceptual lightness"

        if (Y <= (216 / 24389)) {    // The CIE standard states 0.008856 but 216/24389 is the intent for 0.008856451679036
            return Y * (24389 / 27);  // The CIE standard states 903.3, but 24389/27 is the intent, making 903.296296296296296
        } else {
            return Math.pow(Y, (1 / 3)) * 116 - 16;
        }
    }
}

export { colorList, getLightness };
