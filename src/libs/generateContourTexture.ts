import { generateGrid } from './generateGrid';

interface ContourCanvasOptions {
  size?: number;
  frequency?: number;
  bands?: number;
  lineColor?: string;
  lineWidth?: number;
  blur?: number;
}

export function generateContourCanvas({
  size = 1024,
  frequency = 0.01,
  bands = 14,
  lineColor = 'rgba(0, 0, 0, 0.3)',
  lineWidth = 1.5,
  blur = 6,
}: ContourCanvasOptions = {}): HTMLCanvasElement {
  const grid = generateGrid(size, size, frequency);

  const lines = document.createElement('canvas');
  lines.width = size;
  lines.height = size;
  const linesCtx = lines.getContext('2d');
  if (!linesCtx) {
    throw new Error('Cannot get 2d context in generateContourCanvas()');
  }

  const bandOf = (value: number) => Math.floor(value * bands);
  const half = Math.ceil(lineWidth / 2);

  linesCtx.fillStyle = lineColor;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const band = bandOf(grid[x][y]);
      const right = x + 1 < size ? bandOf(grid[x + 1][y]) : band;
      const down = y + 1 < size ? bandOf(grid[x][y + 1]) : band;
      if (band !== right || band !== down) {
        linesCtx.fillRect(x - half, y - half, lineWidth, lineWidth);
      }
    }
  }

  if (blur <= 0) {
    return lines;
  }

  const blurred = document.createElement('canvas');
  blurred.width = size;
  blurred.height = size;
  const blurredCtx = blurred.getContext('2d');
  if (!blurredCtx) {
    return lines;
  }
  blurredCtx.filter = `blur(${blur}px)`;
  blurredCtx.drawImage(lines, 0, 0);

  return blurred;
}
