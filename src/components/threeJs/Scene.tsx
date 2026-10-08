import { useContext, Suspense, type Ref, useMemo } from 'react';
import { type Mesh } from "three";
import { maxBy } from "lodash";

import FallBackLoader from "./FallBackLoader";
import TopographyWrapper from "./TopographyWrapper";
import Frame from "./Frame";
import GalleryRoom from './GalleryRoom';
import { Globals } from '@react-spring/three';

import { RendererContext } from "../../context/RendererContextWrapper";

import { type Shape } from "../../hooks/useTopography";

// https://github.com/pmndrs/react-spring/issues/1586
Globals.assign({
  frameLoop: "always",
});


interface SceneProps {
  shapes: Shape[];
  widthTerrain: number;
  heightTerrain: number;
  meshRef: Ref<Mesh>;
  optimized: boolean;
}

const BaseHeight = 30;
const OceanHeight = 15;

function Scene({ 
  shapes,
  meshRef,
  widthTerrain,
  heightTerrain,
  optimized
} : SceneProps) {
  const {
    animationState
  } = useContext(RendererContext);

  const maxElevation = useMemo(() => {
    return maxBy(shapes, "elevation")!.elevation;
  }, [shapes.length]);

  return (
    <Suspense fallback={<FallBackLoader/>} >
    <GalleryRoom />
     <group
        position={[-widthTerrain/2, BaseHeight, heightTerrain/2]}
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
      <mesh
        position={[0, BaseHeight/2, 0]}
      >
        <boxGeometry args={[widthTerrain, OceanHeight, heightTerrain]} />
        <meshStandardMaterial color="#092a5e" />
      </mesh>
      <Frame width={widthTerrain} height={heightTerrain} depth={BaseHeight} position={[0, 0, (heightTerrain)/2]}/>
    </Suspense>
  );
};

export default Scene;