import { useRef, Suspense, useEffect } from 'react';
import { animated, useSprings } from '@react-spring/three';
import useSound from 'use-sound';
import { Canvas } from '@react-three/fiber';
import { GizmoHelper, GizmoViewport, Stage, Grid, Stats, CameraControls } from '@react-three/drei';
import { Vector2, type Mesh} from "three";
import FallBackLoader from "./FallBackLoader";
import { EffectComposer, Bloom, ChromaticAberration, Grid as GridP, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import TopologyShape from './TopologyShape';
import useTopography from "../hooks/useTopography";


const { /*BASE_URL,*/ MODE } = import.meta.env;


interface ThreeJsRendererProps {
}

const width = 200;
const height = 200;
const numberOfLayers = 10;
const thickness = 5;

const OriginalPosition = 400;

function ThreejsRenderer({
} : ThreeJsRendererProps ): React.ReactElement {
  const meshRef = useRef<Mesh|null>(null);
  const cameraControllerRef = useRef<CameraControls>(null);
  const { generate, shapes } = useTopography({width, height, numberOfLayers});
  const [play, { stop }] = useSound('/sounds/pop-down.mp3', { volume: 1. });
  
  const backgroundColor = "#FFAFA0";

  const [springs, api] = useSprings(
    numberOfLayers,
    (springIndex) => {
      return (
        {
          from: { y: OriginalPosition },
          to: async (next, cancel) => {
            await next({ y: OriginalPosition, immediate: true });
            await next({ y: springIndex * (thickness * 2.), delay: springIndex * 500 });
          },
          config: {
            duration: 500
          },
          reset: true,
          onStart: () => {
            if(springIndex === 0) {
              recenter();  
            }
            
          },
          onRest: () => {
            if(springIndex === numberOfLayers) {
              recenter();
            }
            play();
          },
        }
      );
    },
    [shapes]
  );

  async function recenter() {
    if(!meshRef.current || !cameraControllerRef.current) {
      return;
    }

    await cameraControllerRef.current.fitToBox(meshRef.current, true,
      { paddingLeft: 1, paddingRight: 1, paddingBottom: 1, paddingTop: 1 }
    );
  }


  return (
    <div className="flex flex-col gap-5 w-full h-full" style={{ width: '100%', height: '100%'}}>
      <button className="btn btn-primary" onClick={() => generate()}>
        Generate
      </button>
      <div style={{ width: '100%', height: '100%'}}
        className="hover:cursor-grabbing w-full h-full rounded-xl"
      >
        <Canvas
          camera={{ position: [0, 200, 250], fov: 75, far: 500 }}
          dpr={window.devicePixelRatio}
          shadows
          id="three-js-renderer"
        >
          { import.meta.env.MODE === "development" ? <Stats/> : <></> }
          <ambientLight intensity={1.5} />
          <color attach="background" args={[backgroundColor]} />
          <fog attach="fog" args={['red', 20, -5]} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
            <Stage adjustCamera={false} intensity={1} shadows="contact" environment={"sunset"}>
                <Suspense fallback={<FallBackLoader/>} >

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
                            position={[0, 0, springs[index].y]}
                            thickness={thickness}
                          />
                        )
                      })
                    }
                  </group>
                  <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[width, 20, height]} />
                    <meshStandardMaterial color="black" />
                  </mesh>
              </Suspense>
            </Stage>
          { MODE === "development" &&
            <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
              <GizmoViewport labelColor="white" axisHeadScale={1} />
            </GizmoHelper>
          }
          <EffectComposer enableNormalPass={false}>
            <Bloom mipmapBlur luminanceThreshold={1.0} />
            {/*<ChromaticAberration
              blendFunction={BlendFunction.NORMAL} // blend mode
              offset={[0.001, 0.001]} // color offset
            />*/}
            {/*<GridP scale={2} lineWidth={1}  blendFunction={BlendFunction.OVERLAY}/>*/}
            <ToneMapping  mode={ToneMappingMode.UNCHARTED2} />
          </EffectComposer>
          <CameraControls
            ref={cameraControllerRef}
            makeDefault
            smoothTime={1.0}
            minPolarAngle={0.75}
            maxPolarAngle={Math.PI / 1.9}
            minAzimuthAngle={-0.55}
            maxAzimuthAngle={0.55}
            minDistance={10}
            maxDistance={400}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default ThreejsRenderer;
