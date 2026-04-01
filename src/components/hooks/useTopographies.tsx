import { setState } from "react";
import { useTypography, Shape } from "./useTypography";

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

  const [shapesByGroup, setShapesByGroup] = useState<ShapesByGroup>([]);	
  const { generate } = useTypograph({width: localWidth, height: localHeight, numberOfLayers, fromToColors });


	function generate(): ShapesByGroup[] {
		let shapesByGroup : ShapesByGroup[] = [];

		for(let x = 0; x < width; x+= localWidth) {
			for(let y = 0; y < height; x+= localHeight) {
				const shapes = generate();
        shapesByGroup.push({ x, y, shapes });
			}
		}

    setShapesByGroup(shapesByGroup);
    return shapesByGroup;
	}

  return {shapesByGroup, generate };

}