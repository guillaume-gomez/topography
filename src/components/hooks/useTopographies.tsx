import { useState, useEffect } from "react";
import { Vector2, Color } from "three";
import { lerpColors } from "../../colorUtils";
import { generateGrid } from "../../libs/generateGrid";
import { Grid } from "./useGrid";
import { getData } from "../../readJson";
import * as d3 from "d3-contour";

const { BASE_URL } = import.meta.env;

interface TopographyProps {
  width: number;
  height: number;
  numberOfLayers: number;
  fromToColors?: [string, string];
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
  const [frequency, _setFrequency] = useState<number>(0.05);
  const [loadDirectFile, setDirectFile] = useState<boolean>(true);

  useEffect(() => {
    generate();
  }, [numberOfLayers]);

  function computeThresholds(min:number, max :number) : number[] {
    const thresholds = [];
    for(let i = 0; i < numberOfLayers; i++) {
      thresholds.push(i / (numberOfLayers - 1));
    }
    const thresholdsContrained = thresholds.map(threshold => mapRange(threshold, 0.0, 1.0, min, max));
    return thresholdsContrained;
  }

  async function computeGrid(): Grid {
    if(loadDirectFile) {
      const { width, height, values, min, max } = await getData(`${BASE_URL}/presets/volcano.json`);
      return { gridWidth: width, gridHeight: height, data: values, min, max };
    }

    // fallback generate noise to create a grid
    const gridWidth = 64;
    const gridHeight = gridWidth;
    const grid = generateGrid(gridWidth, gridHeight, frequency);

    return {gridWidth, gridHeight, data: grid.flat(), min: 0.1, max: 0.90 };
  }

  async function generate(): Shape[] {
    const shapes : Shape[] = [];
    const { gridWidth, gridHeight, data, min, max } = await computeGrid();
    const contours = d3.contours()
    .size([gridWidth, gridHeight])
    .thresholds(computeThresholds(min, max))
    .smooth(true);

    const result = contours(data.flat());

    const [newWidth, newHeight] = [width, height]; //computeSizeBaseOnData(gridWidth, gridHeight);

    const scaleX = (newWidth/gridWidth);
    const scaleY = (newHeight/gridHeight);

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

  function colorByElevation(index: number): Color {
    if(fromToColors) {
      const colors = lerpColors(fromToColors[0], fromToColors[1], numberOfLayers);
      return new Color(...colors[index % colors.length]);
    }

    return new Color(COLORS_SAMPLE[index % COLORS_SAMPLE.length])
  }

  function computeSizeBaseOnData(gridWidth, gridHeight): [number, number] {
    const ratio = (gridWidth/gridHeight).toFixed(2);
    return [width * ratio, height];
  }

  return { generate, shapes };
}

export default useTopographies;