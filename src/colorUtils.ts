export type RGBNormalizedColor = [number, number, number];

export function hex2rgb(hex: string) : [number, number, number]  {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return [r/255, g/255, b/255 ];
}

export function rgbToHex([r, g, b]: RGBNormalizedColor): string {
  return "#" + (1 << 24 | (r*255) << 16 | (g*255) << 8 | (b*255)).toString(16).slice(1);
}


function linear(x: number): number {
  return x;
}

function easeInQuint(x: number): number {
  return x * x * x * x * x;
}

function easeOutQuint(x: number): number {
  return 1 - Math.pow(1 - x, 5);
}

function easeInOutQuint(x: number): number {
return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

function lerpColor(starColor: RGBNormalizedColor, endColor: RGBNormalizedColor, amt: number): RGBNormalizedColor {
  const [redFrom, greenFrom, blueFrom] = starColor;
  const [redTo, greenTo, blueTo] = endColor;

  return [
    amt * (redTo - redFrom) + redFrom,
    amt * (greenTo - greenFrom) + greenFrom,
    amt * (blueTo - blueFrom) + blueFrom,
  ];
}


export function lerpColors(fromColorHex: string, toColorHex: string, steps: number) {
  const colorFrom = hex2rgb(fromColorHex);
  const colorTo = hex2rgb(toColorHex);

  const colorsRGB : RGBNormalizedColor[] = [];
  const stepFactor = 1 / (steps - 1);

  for(let i = 0; i < steps; i++) {
    colorsRGB.push(lerpColor(colorFrom, colorTo, linear(i * stepFactor)) );
  }

  return colorsRGB;
}