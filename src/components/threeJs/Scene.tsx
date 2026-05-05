import { useContext, Suspense, type Ref } from 'react';
import { type Mesh} from "three";
import { animated, useSprings, useSpring, Globals } from '@react-spring/three';

import SceneBackground from "./SceneBackground";
import FallBackLoader from "./FallBackLoader";
import TopologyShape from './TopologyShape';
import TopologyLine from "./TopologyLine";
import TopographyWrapper from "./TopographyWrapper";

import { Grid } from '@react-three/drei';
import { SettingsContext } from "../../context/SettingsContextWrapper";
import { SoundsContext } from "../../context/SoundsContextWrapper";

import { type Shape } from "../hooks/useTopography";

// https://github.com/pmndrs/react-spring/issues/1586
Globals.assign({
  frameLoop: "always",
});


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
    timerSwitch,
    timerGeneration,
    numberOfLayers,
    animationState
  } = useContext(SettingsContext);
  const {
    playTopographyPieceSound,
    stopTopographyPieceSound
  } = useContext(SoundsContext);

  const [rotationSpring,] = useSpring(
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
              <TopographyWrapper shape={shape} key={index} />
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