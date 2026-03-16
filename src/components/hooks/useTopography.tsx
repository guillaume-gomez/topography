import { useState, useEffect } from "react";
import { Vector2 } from "three";

interface TopographyProps {
  width: number;
  height: number;
  numberOfLayers: number;
}

interface Point {
  x: number;
  y: number;
}

interface Shape {
  color: string;
  points: Vector2[];
}

const COLORS = [
"#F05D5E",
"#0F7173",
"#E7ECEF",
"#272932",
"#D8A47F",
"#CA2E55",
"#FFE0B5",
"#8A6552",
"#462521",
"#BDB246",
"#394053",
"#4E4A59",
"#6E6362",
"#839073",
"#7CAE7A"
]

function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function useTopography({ width, height, numberOfLayers } : TopographyProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    generate();
  }, [width, height, numberOfLayers])

  function generateRandomPolygon(width, height, numPoints = 8): Point[] {
      if (numPoints < 3) throw new Error("Needs at least 3 points to create a shape");

      const points = [];

      const step = (Math.PI * 2)/ numPoints;
      
      const radiusX = width / 2;
      const radiusY = height/ 2;
      for (let m = 0; m < Math.PI * 2; m += step) {
        const r1 = randomInteger(radiusX-20, radiusX);
        const r2 = randomInteger(radiusY-20, radiusY);
        let x = Math.cos(m) * r1 + width/2;
        let y = Math.sin(m) * r2 + height/2;
        points.push({x, y});
      }
      return points;
  }

  function generate(): Shape[] {
    const shapes = [];
    const offset = 20;
    for(let i = 0; i < numberOfLayers; i++) {
      const widthLayer = width - (i*offset);
      const heightLayer = height - (i*offset);

      const shapePoints = generateRandomPolygon(
        widthLayer,
        heightLayer,
        50
      );
      const points = centeredPoints(shapePoints, width/2 - widthLayer/2, height/2 - heightLayer/2);

      const shape = { 
        color: COLORS[i],
        points: points.map(point => new Vector2(point.x, point.y))
      }

      shapes.push(shape);
    }
    setShapes(shapes);
    return shapes;
  }

  function centeredPoints(points: Point[], offsetX: number, offsetY) {
    return points.map(point => ({ x: point.x + offsetX, y: point.y + offsetY }) );
  }

  return { generate, shapes };
}

export default useTopography;