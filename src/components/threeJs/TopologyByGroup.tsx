import { useContext, Suspense, type Ref, useEffect } from 'react';
import { type Mesh} from "three";
import useSound from 'use-sound';
import { animated, useSprings, useSpring, Globals } from '@react-spring/three';

import TopologyShape from './TopologyShape';

import { SettingsContext } from "../SettingsContextWrapper";

import { type Shapes } from "../hooks/useTopography";

interface TopographyByGroupProps {
  position:[number, number, number];
  shapes: Shapes[];
  onAnimationStart: () => void;
  onAnimationEnd: () => void;
}

const Thickness = 5;
const OriginalPosition = 400;

function TopologyByGroup({shapes, position, meshRef, onAnimationStart, onAnimationEnd}) {
  const {
    isLight,
    timerSwitch,
    numberOfLayers,
    animationState,
    timerGeneration,
  } = useContext(SettingsContext);
  const [play, { stop }] = useSound('/sounds/44062__feegle__gamepiece.wav', { volume: 1. });

  const shapeToDisplay = useSpring({
    opacity: isLight ? 1.0 : 1.0,
    config: { duration: timerSwitch}
  });

  const durationByLayer = timerGeneration / numberOfLayers;

  const [springs, apiLayers] = useSprings(
    numberOfLayers,
    (springIndex) => {
      // ugly hack because useSprings 10.0.3 rerun everytime Scene props changes 
      if(animationState === "ended") {
        return { y: springIndex * (Thickness * 2.), delay: springIndex * durationByLayer };
      };

      return (
        {
          from: { y: OriginalPosition },
          to: async (next, _cancel) => {
            await next({ y: OriginalPosition, immediate: true });
            await next({ y: springIndex * (Thickness * 2.), delay: springIndex * durationByLayer });
          },
          config: {
            duration: durationByLayer
          },
          reset: true,
          onStart: () => {
            if(springIndex === 0) {
              onAnimationStart();
            }
          },
          onRest: () => {
            if(springIndex === numberOfLayers-1) {
              onAnimationEnd();
            }
            stop();
            play();
          },
        }
      );
    },
    [animationState]
  );

  return (
    <group
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      {
        shapes.map((shape, index) => {
          return (
            <TopologyShape
              key={index}
              points={shape.points}
              color={shape.color}
              position={[0, 0, springs[index].y as unknown as number]}
              // position={[0, 0, index * (Thickness * 2.)]}
              thickness={Thickness}
              opacity={shapeToDisplay.opacity}
            />
          )
        })
      }
    </group>
  );
}

export default TopologyByGroup;