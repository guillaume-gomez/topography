import { useContext } from 'react';
import TopologyShape from './TopologyShape';
import TopologyLine from "./TopologyLine";
import { useSpring } from '@react-spring/three';

import { SettingsContext } from "../../context/SettingsContextWrapper";
import { SoundsContext } from "../../context/SoundsContextWrapper";

import { type Shape } from "../hooks/useTopography";

interface TopographyWrapperProps {
  shape: Shape;
  optimized: boolean;
}

const Thickness = 2.5;
const OriginalPosition = -50;

function TopographyWrapper({ shape, optimized } : TopographyWrapperProps) {
  const {
    width,
    height,
    isLight,
    timerSwitch,
    timerGeneration,
    numberOfLayers,
    setAnimationState,
    animationState
  } = useContext(SettingsContext);

  const {
    playTopographyPieceSound,
    stopTopographyPieceSound
  } = useContext(SoundsContext);
  
  const shapeToDisplay = useSpring({
    opacity: isLight ? 1.0 : 0.0,
    config: { duration: timerSwitch}
  });

  const lineToDisplay = useSpring({
    opacity: isLight ? 0.0 : 1.0,
    config: { duration: timerSwitch}
  });

  const durationByLayer = timerGeneration / numberOfLayers;

  const [spring, ] = useSpring(() => {
      // ugly hack because useSprings 10.0.3 rerun everytime Scene props changes
      if(animationState === "ended") {
        return { x: 0, y: 0, z: shape.elevation * (Thickness * 2.), delay: shape.elevation * durationByLayer, scale: 1 };
      }

      return {
        from: { y: OriginalPosition },
        to: async (next, _cancel) => {
          await next({ x: width/2 * 0.1, y: height/2 * 0.1, z: OriginalPosition, scale: 0.9, immediate: true });
          await next({ x: 0, y: 0, z: 0, scale: 1, delay: shape.elevation * durationByLayer });
          await next({ x: 0, y: 0, z: shape.elevation * (Thickness * 2.), scale: 1 });
        },
        config: {
          duration: durationByLayer
        },
        onStart:() => {
          if(shape.elevation === 0) {
            setAnimationState("started");
          }
        },
        onRest: () => {
          if(shape.elevation === numberOfLayers-1) {
            setAnimationState("ended");
          }
          stopTopographyPieceSound();
          playTopographyPieceSound();
        },
        reset: true,
      }
    },
    [animationState]
  );


	return (
    <>
      <TopologyShape
        points={shape.points}
        color={shape.color}
        position={[spring.x, spring.y, spring.z as unknown as number]}
        scale={spring.scale}
        //position={[0, 0, shape.elevation * Thickness]}
        thickness={Thickness}
        opacity={shapeToDisplay.opacity}
        optimized={optimized}
      />
      <TopologyLine
        points={shape.points}
        color={shape.color}
        position={[0, 0, spring.z as unknown as number]}
        //position={[0, 0, shape.elevation * Thickness]}
        thickness={Thickness * 0.5}
        opacity={lineToDisplay.opacity}
      />
    </>
  );
}

export default TopographyWrapper;