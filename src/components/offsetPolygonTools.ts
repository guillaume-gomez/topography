

function offsetPoints(pts, offset) {
  let newPoints = [];
  for (let j = 0; j < pts.length; j++) {
      let i = (j - 1);
      if (i < 0) i += pts.length;
      let k = (j + 1) % pts.length;

      let v1 = [pts[j].x - pts[i].x, pts[j].y - pts[i].y];
      let mag1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1])
      v1 = [v1[0] / mag1, v1[1] / mag1]
      v1 = [v1[0] * offset, v1[1] * offset]
      let n1 = [-v1[1], v1[0]];
      let x1 = pts[i].x + n1[0];
      let y1 = pts[i].y + n1[1];
      let x2 = pts[j].x + n1[0];
      let y2 = pts[j].y + n1[1];

      let v2 = [pts[k].x - pts[j].x, pts[k].y - pts[j].y];
      let mag2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1])
      v2 = [v2[0] / mag2, v2[1] / mag2]
      v2 = [v2[0] * offset, v2[1] * offset]
      let n2 = [-v2[1], v2[0]];
      let x3 = pts[j].x + n2[0];
      let y3 = pts[j].y + n2[1];
      let x4 = pts[k].x + n2[0];
      let y4 = pts[k].y + n2[1];

      let den = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
      let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / den;
      let x = x1 + ua * (x2 - x1);
      let y = y1 + ua * (y2 - y1);

      newPoints.push({ x, y });
  }

  return newPoints;
}



interface Point {
  x: number;
  y: number;
}


function fromShapeToPolygon(points: Point[]): GeometryPoint[] {
  return points.map(point => ({ 'x': point.x, 'y': point.y } ));
}

function fromPolygonToShape(polygon: GeometryPoint[]): Point[] {
  return polygon.map(point => ({ x: point['x'], y: point['y'] }));
}


export function offsetShape(points: Point[], offset: number, arcSegments: number = 5): Point[] {

  return offsetPoints(points, offset);
}