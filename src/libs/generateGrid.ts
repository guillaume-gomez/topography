import { createNoise2D } from 'simplex-noise';

const OFFSET = 512;
const SCALE = 0.05;
const noiseBase = createNoise2D();

function scale(val: number, src: [number, number], dst: [number, number]): number {
  return ((val - src[0]) / (src[1] - src[0])) * (dst[1] - dst[0]) + dst[0]
}

export function generateGrid(
  width: number,
  height: number,
  noise :NoiseFunction2D = noiseBase,
  offset = OFFSET,
  scaling = SCALE,
): number[][] {
  const grid: number[][] = [];

  for (let x = 0; x < width; x += 1) {
    const row: number[] = [];
    for (let y = 0; y < height; y += 1) {
      row.push(scale((noise(offset + x * scaling, offset + y * scaling)), [-1, 1], [0, 1]));
    }
    grid.push(row);
  }

  return grid;
}

export function showGrid(grid: number[][]): void {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext('2d');
  const canvasWidth = grid.length;
  const canvasHeight = grid.length;

  const id = context.getImageData(0, 0, canvasWidth, canvasHeight);
  const pixels = id.data;

  const gridPixels = grid.flat();

  for(let i = 0, j = 0; j < gridPixels.length; i += 4, j++) {
    pixels[i] = gridPixels[j];
    pixels[i + 1] = gridPixels[j];
    pixels[i + 2] = gridPixels[j];
    pixels[i + 3] = 1;
  }

  context.putImageData(id, 0, 0);
}