import { useContext, Suspense, type Ref } from 'react';
import { type Mesh} from "three";
import useSound from 'use-sound';
import { animated, useSprings, useSpring } from '@react-spring/three';

import SceneBackground from "./SceneBackground";
import FallBackLoader from "./FallBackLoader";
import TopologyShape from './TopologyShape';
import { Grid } from '@react-three/drei';
import { SettingsContext } from "../SettingsContextWrapper";

import { type Shape } from "../hooks/useTopography";



interface SceneProps {
  shapes: Shape[];
  meshRef: Ref<Mesh>;
}

const { /*BASE_URL,*/ MODE } = import.meta.env;
const Thickness = 5;
const OriginalPosition = 400;

function Scene({ shapes, meshRef } : SceneProps) {
  const {
    isLight,
    width,
    height,
    numberOfLayers
  } = useContext(SettingsContext);
  
  const [play, { stop }] = useSound('/sounds/44062__feegle__gamepiece.wav', { volume: 1. });

  const shapeToDisplay = useSpring({
    opacity: isLight ? 1.0 : 0.5,
    config: { duration: 3000}
  })

  const [springs, _api] = useSprings(
    numberOfLayers,
    (springIndex) => {
      return (
        {
          from: { y: OriginalPosition },
          to: async (next, _cancel) => {
            await next({ y: OriginalPosition, immediate: true });
            await next({ y: springIndex * (Thickness * 2.), delay: springIndex * 500 });
          },
          config: {
            duration: 500
          },
          reset: true,
          onStart: () => {
            if(springIndex === 0) {
              //recenter();
            }
            
          },
          onRest: () => {
            if(springIndex === numberOfLayers-1) {
              //recenter();
            }
            stop();
            play();
          },
        }
      );
    },
    [shapes]
  );


  const [rotationSpring, __api] = useSpring(
  {
    from: { y: 0, rotationY: 0, },
    to: { y: 0, rotationY: Math.PI * 2,},
    config: {
      duration: 800
    },
    reset: true,
  },
  [shapes]
  );


  return (
    <Suspense fallback={<FallBackLoader/>} >
     <SceneBackground isLight={isLight}/>
      { MODE === "development" &&
        <Grid args={[1000, 1000]} position={[0,0,0]} cellColor='green' />
      }

      <group
        position={[-width/2, 15, height/2]}
        rotation={[-Math.PI / 2, 0, 0]}
        ref={meshRef.current}
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
              />
            )
          })
        }
      </group>
      <animated.mesh position-y={rotationSpring.y} rotation-y={rotationSpring.rotationY}>
        <boxGeometry args={[width, 20, height]} />
        <meshStandardMaterial color="black" />
      </animated.mesh>
    </Suspense>
  );
};

export default Scene;