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
]

function useTopography({ width, height, numberOfLayers } : TopographyProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    generate();
  }, [width, height, numberOfLayers])

  function generateRandomPolygon(width, height, numPoints = 8): Point[] {
      if (numPoints < 3) throw new Error("Needs at least 3 points to create a shape");

      const points : Point[] = [];
      const centerX = width / 2;
      const centerY = height / 2;

      // Generate random points
      for (let i = 0; i < numPoints; i++) {
          points.push({
              x: Math.random() * width,
              y: Math.random() * height
          });
      }

      // compute centroid
      let sumX = 0, sumY = 0;
      for (const p of points) {
          sumX += p.x;
          sumY += p.y;
      }
      const centroid = { x: sumX / numPoints, y: sumY / numPoints };

      // sort points to avoid crossed between points
      points.sort((a, b) => {
          const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
          const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
          return angleA - angleB;
      });

      return points;
  }

  function generate(): Shape[] {
    const shapes = [];
    const offset = 10;
    for(let i = 0; i < numberOfLayers; i++) {
      const shapePoints = generateRandomPolygon(
        width - (i*offset),
        height - (i*offset),
        20
      );

      const shape = { 
        color: COLORS[i],
        points: shapePoints.map(point => new Vector2(point.x, point.y))
      }

      shapes.push(shape);
    }
    setShapes(shapes);
    return shapes;
  }

  return { generate, shapes };
}

export default useTopography;