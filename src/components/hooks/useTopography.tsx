import { useState, useEffect } from "react";
import { Vector2 } from "three";
import { createNoise2D } from 'simplex-noise';

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

function mapRange (n, start1, stop1, start2, stop2) {
  return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

function useTopography({ width, height, numberOfLayers } : TopographyProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    generate();
  }, [width, height, numberOfLayers])

  function generateRandomPolygon(width, height, numPoints = 8): Point[] {
      if (numPoints < 3) throw new Error("Needs at least 3 points to create a shape");
      const simplex = new createNoise2D();

      const points = [];

      const step = (Math.PI * 2)/ numPoints;
      const radius = width / 2;

      for (let m = 0; m < Math.PI * 2; m += step) {
        const noiseValue = simplex(
          Math.cos(m) * 0.5,
          Math.sin(m) * 0.5
        );
      
        // Convertir le bruit (-1 à 1) en variation de rayon (0.7 à 1.3)
        const rayonVarie = mapRange(noiseValue, -1, 1, 0.7, 1.3) * radius;
      
        const x = Math.cos(m) * rayonVarie;
        const y = Math.sin(m) * rayonVarie;
        points.push({x, y});

      }
      return points;
  }

  function generateSquaredRandomPolygon(width, height, numPoints= 8): Point[] {
    if (numPoints < 2) throw new Error("Needs at least 2 points to create a shape");

    const simplex = new createNoise2D();
    
    const points = [];
    points.push({x: 0, y: height})
    points.push({x: 0, y: 0})
    points.push({x: width, y: 0})

    const radius = width;
    const step = (Math.PI /2)/(numPoints - 3);
    for (let m = 0; m < Math.PI/2; m += step) {
      const noiseValue = simplex(
        Math.cos(m) * 0.5,
        Math.sin(m) * 0.5
      );
        const rayonVarie = mapRange(noiseValue, -1, 1, 0.7, 1.1) * radius;
      
        const x = Math.cos(m) * rayonVarie;
        const y = Math.sin(m) * rayonVarie;
        points.push({x, y});
    }
    return points;

  }

  function generate(): Shape[] {
    const shapes = [];
    const offset = 25;
    for(let i = 0; i < numberOfLayers; i++) {
      const widthLayer = width - (i*offset);
      const heightLayer = height - (i*offset);

      const shapePoints = generateRandomPolygon(
        widthLayer,
        heightLayer,
        50,
      );
      //const points = shapePoints;

      // for  generateRandomPolygon, needs the function below
      const points = centeredPoints(shapePoints, width/2, height/2);

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