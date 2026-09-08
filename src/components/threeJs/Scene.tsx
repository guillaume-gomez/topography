import { useContext, Suspense, type Ref } from 'react';
import { type Mesh} from "three";
import { animated, useSpring, Globals } from '@react-spring/three';

import FallBackLoader from "./FallBackLoader";
import TopographyWrapper from "./TopographyWrapper";
import Frame from "./Frame";

import { SettingsContext } from "../../context/SettingsContextWrapper";

import { type Shape } from "../hooks/useTopography";

// https://github.com/pmndrs/react-spring/issues/1586
Globals.assign({
  frameLoop: "always",
});


interface SceneProps {
  shapes: Shape[];
  meshRef: Ref<Mesh>;
  optimized: boolean;
}

const BaseHeight = 30;
const OceanHeight = 15;

function Scene({ shapes, meshRef, optimized } : SceneProps) {
  const {
    width,
    height,
    animationState
  } = useContext(SettingsContext);

  const [rotationSpring,] = useSpring(
  {
    from: { y: 0, rotationY: 0, },
    to: { y: BaseHeight/2, rotationY: Math.PI * 2,},
    config: {
      duration: 800
    },
    reset: false,
  },
  [animationState]
  );

  return (
    <Suspense fallback={<FallBackLoader/>} >
     <group
        position={[-width/2, BaseHeight, height/2]}
        rotation={[-Math.PI / 2, 0, 0]}
        ref={meshRef}
      >
        {
          shapes.map((shape, index) => {
            return (
              <TopographyWrapper shape={shape} key={index} optimized={optimized} />
            )
          })
        }
      </group>
      <animated.mesh
        position-x={0}
        position-y={rotationSpring.y}
        rotation-y={rotationSpring.rotationY}
      >
        <boxGeometry args={[width, OceanHeight, height]} />
        <meshStandardMaterial color="#092a5e" />
      </animated.mesh>
      <Frame width={width} height={height} depth={BaseHeight} position={[0, 0, (height)/2]}/>
    </Suspense>
  );
};

export default Scene;