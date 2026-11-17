import { useRef, useMemo } from "react";
import { groupBy } from "lodash";

interface UseExportShapesParams {
	width: number;
	height: number;
}

function useExportShapes({width, height}: UseExportShapesParams) {
	const canvas = useMemo(() => {
		const c = document.createElement("canvas");
		c.width = width;
		c.height = height;
		return c;
	}, [width, height]);

  const context = useMemo(() => {
    return canvas.getContext("2d");
  }, [canvas]);

  function call(shapes: Shape[]) {
    const shapesByElevation = shapesGroupedByElevation(shapes);
    
    // clear the canvas
    context.clearRect(0, 0, width, height);

    Object.values(shapesByElevation).forEach(shapes => {
      drawByElevation(shapes);
      // to do : new tab for print
      print();  
    })
    
	}

	function print() {
		const dataImage = canvas.toDataURL("image/png");

    const fen = window.open();
    // ouverture du document pour écriture
    fen.document.open();
    // insére un élément "<img> avec l'attribut src contenant les données de l'image
    fen.document.write("<img src='" + dataImage + "'>");
    // fermeture du document
    fen.document.close();
    // lance l'impression dès que chargé
    fen.onload = setTimeout(() => {
        fen.print();
        fen.close();
    }, 100);
	}

	function draw(shape: Shape) {
		
		const { points } = shape;

		const startingPoint = points[0];

		context.fillStyle = '#' + shape.color.getHexString();
    context.strokeStyle = '#' + shape.color.getHexString();
    
		context.beginPath();
		context.moveTo(startingPoint.x, startingPoint.y);
		
		for(let i = 1; i < points.length; i++)
    {
			const point = points[ i ];
      context.lineTo(point.x, point.y);
		}
	
    context.lineTo(startingPoint.x, startingPoint.y);
	  context.closePath();
		
    context.fill();
    //context.stroke();
	}

  function drawByElevation(shapesForAnElevation: Shape[]) {
    context.clearRect(0, 0, width, height);

    shapesForAnElevation.forEach(shape => draw(shape));
  }

  function shapesGroupedByElevation(shapes: Shape[]) {
    return groupBy(shapes, 'elevation');
  }

  return call;
}

export default useExportShapes;