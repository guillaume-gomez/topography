import { useRef, useEffect } from "react";
import { line } from "./drawLine";
import type { Shape } from "../components/hooks/useTopographies";

interface CanvasTest {
  shapes: Shape[];
}
function CanvasTest({shapes} : CanvasTest) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);

  useEffect(() => {
    if(canvasRef.current) {
      contextRef.current = canvasRef.current.getContext("2d");
    }
  }, [canvasRef.current])

	useEffect(() => {
    if(!contextRef.current) {
      return;
    }
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
        line(shape.points[i], shape.points[i+1], contextRef.current!, "#" + shape.color.getHexString())
      }
    });
  }, [contextRef.current]);


  return (
    <div className="w-full h-screen">
      <canvas ref={canvasRef} width={1000} height={1000} />
    </div>
  )
}

export default CanvasTest;