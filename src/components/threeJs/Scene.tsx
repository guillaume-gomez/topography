import { useContext, Suspense, type Ref, useMemo } from 'react';
import { type Mesh } from "three";
import { animated, useSpring, Globals } from '@react-spring/three';
import { maxBy } from "lodash";

import FallBackLoader from "./FallBackLoader";
import TopographyWrapper from "./TopographyWrapper";
import Frame from "./Frame";
import MarbleBase from "./MarbleBase";

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

const FrameHeight = 30;
const OceanHeight = 15;

const BasePosition: [number, number, number] = [0, -30, 50];

function Scene({ shapes, meshRef, optimized } : SceneProps) {
  const {
    width,
    height,
    animationState
  } = useContext(SettingsContext);

  const [rotationSpring,] = useSpring(
  {
    from: { y: 0, rotationY: 0, },
    to: { y: FrameHeight/2, rotationY: Math.PI * 2,},
    config: {
      duration: 800
    },
    reset: false,
  },
  [animationState]
  );

  const maxElevation = useMemo(() => {
    return maxBy(shapes, "elevation").elevation;
  }, [shapes.length]);

  return (
    <Suspense fallback={<FallBackLoader/>} >
     <group
        position={[-width/2, FrameHeight, height/2]}
        rotation={[-Math.PI / 2, 0, 0]}
        ref={meshRef}
      >
        {
          shapes.map((shape, index) => {
            return (
              <TopographyWrapper
                key={index} 
                shape={shape}
                maxElevation={maxElevation}
                optimized={optimized}/>
            )
          })
        }
      </group>
      {/*<animated.mesh
        position-x={0}
        position-y={rotationSpring.y}
        rotation-y={rotationSpring.rotationY}
      >
        <boxGeometry args={[width, OceanHeight, height]} />
        <meshStandardMaterial color="#092a5e" />
      </animated.mesh>*/}
       {/*<Frame width={width} height={height} depth={FrameHeight} position={[0, 0, (height)/2]}/>*/}
      <MarbleBase position={[0, -0, 0]} size={[width * 1.1, 50, height * 1.25]} text="Auvergne Topo" />
    </Suspense>
  );
};

export default Scene;