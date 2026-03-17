import offsetPolygon from "offset-polygon";

interface GeometryPoint {
  'x': number;
  'y': number;
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


export function offsetShape(points: Point[], offset: number, arcSegments: number = 0): Point[] {
  const polygon = fromShapeToPolygon(points);

  const newPolygon = offsetPolygon(polygon, offset, arcSegments);

  return fromPolygonToShape(newPolygon);
}