import { useContext, Suspense, type Ref } from 'react';
import { type Mesh } from "three";
import { animated, useSpring, Globals } from '@react-spring/three';
import { Grid } from '@react-three/drei';

import SceneBackground from "./SceneBackground";
import FallBackLoader from "./FallBackLoader";
import TopologyByGroup from './TopologyByGroup';
import { SettingsContext } from "../SettingsContextWrapper";
import { type ShapesByGroup } from "../hooks/useTopographies"


// https://github.com/pmndrs/react-spring/issues/1586
Globals.assign({
  frameLoop: "always",
});

interface SceneProps {
  shapesByGroup: ShapesByGroup[];
  meshRef: Ref<Mesh>;
  onAnimationStart: () => void;
  onAnimationEnd: () => void;
}

const { /*BASE_URL,*/ MODE } = import.meta.env;

function Scene({ shapesByGroup, meshRef, onAnimationStart, onAnimationEnd} : SceneProps) {
  const {
    width,
    height,
    animationState
  } = useContext(SettingsContext);


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

  console.log(shapesByGroup)
  return (
    <Suspense fallback={<FallBackLoader/>} >
     <SceneBackground/>
      { MODE === "development" &&
        <Grid args={[1000, 1000]} position={[0,0,0]} cellColor='green' />
      }

      <group ref={meshRef.current}
        position={[-width/2, 15, height/2]}
      >
        {
          shapesByGroup.map(({x, y, shapes}) => {
            return (<TopologyByGroup
              position={[x, 0, y]}
              shapes={shapes}
              onAnimationEnd={onAnimationEnd}
              onAnimationStart={onAnimationStart}
            />)
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