import { useRef, useEffect } from "react";
import { generateGrid } from "./generateGrid";
import { marchingSquares, line } from "./marchingSquares";
import * as d3 from "d3-contour";


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

function CanvasTest({shapes}) {
  const canvasRef = useRef<HTMLCanvasElement>();
  const contextRef = useRef<CanvasRenderingContext2D>();

  useEffect(() => {
    if(canvasRef.current) {
      contextRef.current = canvasRef.current.getContext("2d");
    }
  }, [canvasRef.current])

	useEffect(() => {
    // standalone
    // const grid = generateGrid(512, 512);
    // const contours = d3.contours()
    // .size([512, 512])
    // .thresholds([0.45, 0.47, 0,50, 0.64, 0.70, 0.75, 0.85, 0.9])
    // .smooth(true);

    // const result = contours(grid.flat());
    // result.forEach((threshold, index) => {
    //   threshold.coordinates.forEach(coordinate => {
    //     const vertexes = coordinate[0];
    //     for(let i = 0; i < vertexes.length - 1; i++) {
    //       line(vertexes[i], vertexes[i+1], contextRef.current,COLORS_SAMPLE[index])
    //     }
    //   });
    // })
    
    // from the params shapes
    //console.log(shapes)
    shapes.forEach(shape => {
      for(let i = 0; i < shape.points.length - 1; i++) {
        line(shape.points[i], shape.points[i+1], contextRef.current, "#" + shape.color.getHexString())
      }
    });


    //const segments = marchingSquares(grid, /*[0.2, 0.4, 0.5, 0.8]*/ [0.8], contextRef.current, true, "#FBDA51");

    //console.log(segments)
  }, [contextRef.current]);


  return (
    <div className="w-full h-screen">
      <canvas ref={canvasRef} width={1000} height={1000} />
    </div>
  )
}

export default CanvasTest;