import type { Vector2 } from "three";

const SPACE = 15;
const green = '#0BDA51';

export function line(
  point1: Vector2,
  point2: Vector2,
  ctx: CanvasRenderingContext2D,
  colour = green,
  space = SPACE,
) : void {
  const [x1, y1] = point1;
  const [x2, y2] = point2;
  ctx.beginPath();
  ctx.moveTo(x1 * space, y1 * space);
  ctx.lineTo(x2 * space, y2 * space);
  ctx.save();
  ctx.strokeStyle = colour;
  ctx.stroke();
  ctx.restore();
  ctx.closePath();
};
