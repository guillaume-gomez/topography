import { useState, useEffect } from "react";
import { Vector2, Color } from "three";
import { createNoise2D } from 'simplex-noise';
import { lerpColors } from "../../colorUtils";
import { generateGrid, showGrid } from "../../libs/generateGrid";
import * as d3 from "d3-contour";

interface TopographyProps {
  width: number;
  height: number;
  numberOfLayers: number;
  fromToColors?: [string, string];
}

interface Point {
  x: number;
  y: number;
}

export interface Shape {
  color: Color;
  points: Vector2[];
  elevation: number;
}

const COLORS_SAMPLE = [
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

function mapRange (n: number, start1: number, stop1: number, start2: number, stop2: number) : number {
  return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

function useTopographies({ width, height, numberOfLayers, fromToColors } : TopographyProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [frequency, _setFrequency] = useState<number>(0.5);
  const [minRadiusRatio, _setMinRadiusRatio] = useState<number>(0.7);
  const [maxRadiusRatio, _setMaxRadiusRatio] = useState<number>(1.1);

  useEffect(() => {
    generate();
  }, [width, height, numberOfLayers])

  function generate(): Shape[] {
    const shapes = [];
    const gridWidth = 64;
    const gridHeight = gridWidth;
    
    const grid = generateGrid(gridWidth, gridHeight);
    showGrid(grid);
    const contours = d3.contours()
    .size([gridWidth, gridHeight])
    .thresholds([0.1, 0.2,0.3, 0.4, 0.5, 0.6, 0.7, 0.8])
    .smooth(true);

    const result = contours(grid.flat());

    const scaleX = Math.floor(width/gridWidth);
    const scaleY =  Math.floor(height/gridHeight)
    
    result.forEach((threshold, thresholdIndex) => {
      threshold.coordinates.forEach(coordinate => {
        const vertexes = coordinate[0];
        const points  = vertexes.map(([x, y]) => ({x, y}));
        
        const shape = { 
          color: colorByElevation(thresholdIndex),
          points: points.map(point => new Vector2(point.x * scaleX, point.y * scaleY)),
          elevation: thresholdIndex
        }
        shapes.push(shape);
      });
    });

    setShapes(shapes);
    return shapes;
  }

  function colorByElevation(number: index): Color {
    if(fromToColors) {
      const colors = lerpColors(fromToColors[0], fromToColors[1], numberOfLayers);
      return new Color(...colors[number % colors.length]);
    }

    return new Color(COLORS_SAMPLE[number % COLORS_SAMPLE.length])
  }

  return { generate, shapes };
}

export default useTopographies;