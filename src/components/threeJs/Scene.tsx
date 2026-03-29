import { useContext, Suspense, type Ref, useEffect, useState } from 'react';
import { type Mesh} from "three";
import useSound from 'use-sound';
import { animated, useSprings, useSpring, Globals } from '@react-spring/three';
import SceneBackground from "./SceneBackground";
import FallBackLoader from "./FallBackLoader";
import TopologyShape from './TopologyShape';
import { Grid, usePerformanceMonitor } from '@react-three/drei';
import { SettingsContext } from "../SettingsContextWrapper";

import { type Shape } from "../hooks/useTopography";

// https://github.com/pmndrs/react-spring/issues/1586
Globals.assign({
  frameLoop: "always",
});


interface SceneProps {
  shapes: Shape[];
  meshRef: Ref<Mesh>;
  onAnimationStart: () => void;
  onAnimationEnd: () => void;
}

const { /*BASE_URL,*/ MODE } = import.meta.env;
const Thickness = 5;
const OriginalPosition = 400;

function Scene({ shapes, meshRef, onAnimationStart, onAnimationEnd} : SceneProps) {
  const {
    isLight,
    width,
    height,
    timerSwitch,
    timerGeneration,
    numberOfLayers,
    animationState
  } = useContext(SettingsContext);
  const [play, { stop }] = useSound('/sounds/44062__feegle__gamepiece.wav', { volume: 1. });
  const [optimized, setOptimized] = useState<boolean>(true);


  usePerformanceMonitor({ onFallback: () => setOptimized(false) })

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

  const [rotationSpring, apiRotation] = useSpring(
  {
    from: { y: 0, rotationY: 0, },
    to: { y: 0, rotationY: Math.PI * 2,},
    config: {
      duration: 800
    },
    reset: false,
  },
  [animationState]
  );


  return (
    <Suspense fallback={<FallBackLoader/>} >
     <SceneBackground/>
      { MODE === "development" &&
        <Grid args={[1000, 1000]} position={[0,0,0]} cellColor='green' />
      }

      <group
        position={[-width/2, 15, height/2]}
        rotation={[-Math.PI / 2, 0, 0]}
        ref={meshRef}
      >
        {
          shapes.map((shape, index) => {
            return (
              <TopologyShape
                key={index}
                points={shape.points}
                color={shape.color}
                position={[0, 0, springs[index].y as unknown as number]}
                thickness={Thickness}
                opacity={shapeToDisplay.opacity}
                optimized={optimized}
              />
            )
          })
        }
      </group>
      <animated.mesh position-y={rotationSpring.y} rotation-y={rotationSpring.rotationY}>
        {/*<boxGeometry args={[width * 5, 20, height * 5]} />*/}
        <cylinderGeometry args={[1.25 * width + 25, 1.25 * width + 25, 20, 64]} />
        <meshStandardMaterial color="#092a5e" />
      </animated.mesh>
    </Suspense>
  );
};

export default Scene;