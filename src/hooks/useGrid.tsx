import { useState, useEffect } from "react";
import { getData } from "../readJson";
import { generateGrid } from "../libs/generateGrid";
import { loadImage, resizeImageAndConvertToGrey, resizeImageSize } from "../libs/imageProcessingUtils";

const { BASE_URL } = import.meta.env;


interface UseGridReturn {
  createGrid: () => Promise<Grid>;
  grid: Grid;
}

export interface Grid {
  gridWidth: number;
  gridHeight: number;
  data: number[];
  min: number;
  max: number;
}

interface UseGridProps {
  filepath: string;
  typeOfFile: "noise"|"real-data"|"image";
}


function useGrid({ filepath, typeOfFile }: UseGridProps) : UseGridReturn {
  const [frequency, _setFrequency] = useState<number>(0.05);
  const [grid, setGrid] = useState<Grid>(gridFromNoise());
  
  async function createGrid (): Promise<Grid> {
    const grid = await computeGrid();
    setGrid(grid);

    return grid;
  }

  useEffect(() => {
    createGrid();
  }, [filepath, typeOfFile])

  async function computeGrid(): Promise<Grid> {
    if(typeOfFile === "real-data") {
      return await gridFromRealData();
    }

    if(typeOfFile === "image") {
      return gridFromImage();
    }

    // fallback generate noise to create a grid
    return gridFromNoise();
  }

  function gridFromNoise(): Grid {
    const gridWidth = 64;
    const gridHeight = gridWidth;
    const grid = generateGrid(gridWidth, gridHeight, frequency);

    return {gridWidth, gridHeight, data: grid.flat(), min: 0.1, max: 0.90 };
  }

  async function gridFromRealData(): Promise<Grid> {
    const { width, height, values, min, max } = await getData(`${BASE_URL}/presets/${filepath}`);
    return { gridWidth: width, gridHeight: height, data: values, min, max };
  }

  async function gridFromImage(): Promise<Grid> {
    const image = await loadImage(`${BASE_URL}/presets-images/${filepath}`);
    const greyImageData = resizeImageAndConvertToGrey(image);
    const greyData = fromImageDataToGridData(greyImageData);
    const { expectedWidth, expectedHeight} = resizeImageSize(image.width, image.height);
    return { gridWidth: expectedWidth, gridHeight: expectedHeight, data: greyData, min: 0, max: 255 };
  }

  function fromImageDataToGridData(greyImageData: ImageData): number[] {
    const greyData : number[] = [];
    for(let i = 0; i < greyImageData.data.length; i+= 4) {
      greyData.push(greyImageData.data[i]);
    }

    return greyData;
  }

  return { grid, createGrid };
};

export default useGrid;