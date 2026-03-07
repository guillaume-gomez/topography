import { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { GizmoHelper, GizmoViewport, Stage, Grid, Stats, CameraControls } from '@react-three/drei';
import { Vector2, type Mesh} from "three";
import FallBackLoader from "./FallBackLoader";
import { EffectComposer, Vignette, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import TopologyShape from './TopologyShape';


const { /*BASE_URL,*/ MODE } = import.meta.env;


interface ThreeJsRendererProps {
}

function ThreejsRenderer({
} : ThreeJsRendererProps ): React.ReactElement {
  const meshRef = useRef<Mesh|null>(null);
  const cameraControllerRef = useRef<CameraControls>(null);
  const backgroundColor = "#FFAFA0";
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
      <div style={{ width: '100%', height: '100%'}}
        className="hover:cursor-grabbing w-full h-full rounded-xl"
      >
        <Canvas
          camera={{ position: [0,0, 250], fov: 75, far: 500 }}
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

                  <TopologyShape  points={[
                    new Vector2(0, 0),
                    new Vector2(5, -4),
                    new Vector2(10, 0),
                    new Vector2(10, 10),
                    new Vector2(5, 18),
                    new Vector2(6, 12),
                    new Vector2(8, 3),
                    new Vector2(0, 10),
                  ]} color={"#FF0000"} position={[0,0,0]} />
              </Suspense>
            </Stage>
          { MODE === "development" &&
            <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
              <GizmoViewport labelColor="white" axisHeadScale={1} />
            </GizmoHelper>
          }
          <EffectComposer enableNormalPass={false}>
            <Vignette
              offset={0.1} darkness={2.0} // vignette darkness
              eskil={false} // Eskil's vignette technique
              blendFunction={BlendFunction.NORMAL} // blend mode
            />
            <Bloom mipmapBlur luminanceThreshold={1.0} />
            {/* <ChromaticAberration
              blendFunction={BlendFunction.NORMAL} // blend mode
              offset={[0.05, 0.05]} // color offset
            /> */}
            {/*<GridP scale={0.0} lineWidth={.0}/>*/}
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
            maxDistance={200}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default ThreejsRenderer;
