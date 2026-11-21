import { useContext } from 'react';
import TopologyShape from './TopologyShape';
import TopologyLine from "./TopologyLine";
import { useSpring } from '@react-spring/three';

import { SettingsContext } from "../../context/SettingsContextWrapper";
import { RendererContext } from "../../context/RendererContextWrapper";
import { SoundsContext } from "../../context/SoundsContextWrapper";

import { type Shape } from "../../hooks/useTopography";

interface TopographyWrapperProps {
  shape: Shape;
  optimized: boolean;
  maxElevation: number;
  widthTerrain: number;
  heightTerrain: number;
}

const Thickness = 2.5;
const ScaleShape = 0.9;

//const AnimationStartingFromTop = 500; // other animation
const AnimationStartingFromBottom = -20;

const OriginalPosition = AnimationStartingFromBottom;



function TopographyWrapper({
  shape,
  optimized,
  maxElevation,
  widthTerrain,
  heightTerrain
} : TopographyWrapperProps)
{
  const { numberOfLayers } = useContext(SettingsContext);
  const {
    isLight,
    timerSwitch,
    timerGeneration,
    setAnimationState,
    animationState
  } = useContext(RendererContext);

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

  const [springPosition, ] = useSpring(() => {
      // ugly hack because useSprings 10.0.3 rerun everytime Scene props changes
      if(animationState === "ended") {
        return { x: 0, z: 0, y: shape.elevation * (Thickness * 2.), scale: 1., delay: shape.elevation * durationByLayer };
      }

      return {
        from: {
          // x and y change based on its scale
          x: (widthTerrain - (widthTerrain * ScaleShape))/ 2,
          z: (heightTerrain - (heightTerrain * ScaleShape))/2,
          y: OriginalPosition,
          scale: ScaleShape
        }, 
        to: async (next, _cancel) => {
          await next({
            // x and y change based on its scale
            x: (widthTerrain - (widthTerrain * ScaleShape))/ 2,
            z: (heightTerrain - (heightTerrain * ScaleShape))/2,
            y: OriginalPosition,
            scale: ScaleShape,
            immediate: true, 
          });
          await next({
            x: 0,
            z: 0,
            y: shape.elevation * (Thickness * 2.),
            scale: 1.,
            delay: shape.elevation * durationByLayer
          });
        },
        config: {
          duration: durationByLayer
        },
        onStart:() => {
          if(shape.elevation === 0) {
            setAnimationState("started");
          }
        },
        onRest: (result) => {
          if (!result.finished || result.cancelled) return;
          if(shape.elevation === maxElevation) {
            setAnimationState("ended");
          }
          stopTopographyPieceSound();
          playTopographyPieceSound();
        },
        reset: true,
        delay: 1000
      }
    },
    [animationState]
  );


  return (
    <>
      <TopologyShape
        // y become z due to rotation from the parent
        position={[
          springPosition.x as unknown as number,
          springPosition.z as unknown as number,
          springPosition.y as unknown as number
        ]}
        // without animation below
        // position={[0, 0, shape.elevation * Thickness]}
        points={shape.points}
        color={shape.color}
        thickness={Thickness}
        opacity={shapeToDisplay.opacity}
        scale={springPosition.scale}
        optimized={optimized}
      />

      <TopologyLine
        points={shape.points}
        color={shape.color}
        position={[0, 0, springPosition.y as unknown as number]}
        thickness={Thickness * 0.5}
        opacity={lineToDisplay.opacity}
      />
    </>
  );
}

export default TopographyWrapper;