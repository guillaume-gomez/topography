import { useState } from "react";
import useTopography, { Shape } from "./useTopography";

interface TopographiesProps {
  width: number;
  height: number;
  numberOfLayers: number;
  numberOfTopograhies: number;
  fromToColors?: [string, string];
}


interface ShapesByGroup {
  x: number;
  y: number;
  shapes: Shape[];
}

function useTypographies({ 
	width,
	height,
	numberOfLayers,
	numberOfTopograhies,
	fromToColors
}) {
	const localWidth = width/(numberOfLayers/2);
  const localHeight = height/(numberOfLayers/2);

  const [shapesByGroup, setShapesByGroup] = useState<ShapesByGroup[]>([]);	
  const { generate } = useTopography({width: localWidth, height: localHeight, numberOfLayers, fromToColors });


	function generateShapes(): ShapesByGroup[] {
    console.log(width, localWidth, height, localHeight)
		let shapesByGroup : ShapesByGroup[] = [];

		for(let x = 0; x < width; x+= localWidth) {
			for(let y = 0; y < height; y+= localHeight) {
				const shapes = generate();
        shapesByGroup.push({ x, y, shapes });
			}
		}
    console.log(shapesByGroup)
    setShapesByGroup(shapesByGroup);
    return shapesByGroup;
	}

  return {shapesByGroup, generateShapes };
}

export default useTypographies;