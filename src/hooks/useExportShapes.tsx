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
    let dataImages : string[] = [];
    // clear the canvas
    context.clearRect(0, 0, width, height);

    Object.values(shapesByElevation).forEach(shapes => {
      drawByElevation(shapes);
      // export the result of the drawing, then store it in dataImages array
      const dataImage = canvas.toDataURL("image/png");
      dataImages.push(dataImage);
    })
    print(dataImages);
	}

	function print(dataImages: string[]) {
    const fen = window.open();
    fen.document.open();
    fen.document.write(`<!doctype html>
      <html>
        <head>
          <title>Topologie</title>
          <style>
            /* margin: 0 on @page removes the browser's header/footer (title, url, date) */
            @page { margin: 0; }
            body { margin: 1cm; }
            //img { display: block; max-width: 100%; page-break-after: always; }
          </style>
        </head>
        <body>`
    );

    dataImages.forEach(dataImage => {
      fen.document.write("<img src='" + dataImage + "'>");
    });

    fen.document.write("</body></html>");
    fen.document.close();
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