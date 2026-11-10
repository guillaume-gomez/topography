import { Suspense, type Ref, useMemo } from 'react';
import { type Mesh } from "three";
import { maxBy } from "lodash";

import FallBackLoader from "./FallBackLoader";
import TopographyWrapper from "./TopographyWrapper";
import Frame from "./Frame";
import MarbleBase from "./MarbleBase";
import GalleryRoom from './GalleryRoom';
import { Globals } from '@react-spring/three';

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

const FrameHeight = 30;
const OceanHeight = 15;

const BasePosition: [number, number, number] = [0, -30, 50];

function Scene({ 
  shapes,
  meshRef,
  widthTerrain,
  heightTerrain,
  optimized
} : SceneProps) {
  const maxElevation = useMemo(() => {
    return maxBy(shapes, "elevation")!.elevation;
  }, [shapes]);

  return (
    <Suspense fallback={<FallBackLoader/>} >
    <GalleryRoom />
     <group
        position={[-widthTerrain/2, FrameHeight, heightTerrain/2]}
        rotation={[-Math.PI / 2, 0, 0]}
        ref={meshRef}
      >
        {
          shapes.map((shape) => {
            return (
              <TopographyWrapper
                key={shape.id}
                shape={shape}
                maxElevation={maxElevation}
                optimized={optimized}/>
            )
          })
        }
      </group>
      
      <MarbleBase position={[0, -0, 0]} size={[widthTerrain * 1.1, 50, heightTerrain * 1.25]} text="Guillaume Gomez" />
      {/*<Frame width={widthTerrain} height={heightTerrain} depth={BaseHeight} position={[0, 0, (heightTerrain)/2]}/>*/}
    </Suspense>
  );
};

export default Scene;