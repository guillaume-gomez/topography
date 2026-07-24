import { useRef, useContext, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { type Mesh } from "three";
import { GizmoHelper, GizmoViewport, Stage, Stats, CameraControls, PerformanceMonitor, Gltf } from '@react-three/drei';
import { EffectComposer, Bloom, /*Grid,*/ ToneMapping, TiltShift } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import Scene from "./Scene";
import { type Shape } from "../hooks/useTopography";
import { SettingsContext } from "../../context/SettingsContextWrapper";


const { BASE_URL, MODE } = import.meta.env;


const LAMP_LIGHTS: { name: string; position: [number, number, number] }[] = [
  { name: "icosphereLamp", position: [-120, 165, 0.0] }, // ampoule/suspension ronde
  { name: "cube047Lamp", position: [220, 262, 15],},
];

interface ThreeJsRendererProps {
  shapes: Shape[];
}

function ThreejsRenderer({ shapes } : ThreeJsRendererProps ): React.ReactElement {
  const {
    animationState,
    isLight
  } = useContext(SettingsContext);
  const cameraControllerRef = useRef<CameraControls>(null);
  const meshRef = useRef<Mesh|null>(null);
  const [dpr, setDpr] = useState<number>(1);

  useEffect(() => {
    if(animationState === "started") {
      onAnimationStart();
    }
    if(animationState === "ended") {
      onAnimationEnd();
    }
  },[animationState]);

  useEffect(() => {
    if(!isLight) {
      moveTopDown();
    }
  }, [isLight])
  
  async function recenterCamera() {
    if(!meshRef.current || !cameraControllerRef.current) {
      return;
    }

    await cameraControllerRef.current.fitToBox(meshRef.current, true,
      { paddingLeft: 1, paddingRight: 1, paddingBottom: 1, paddingTop: 1 }
    );
  }

  async function moveTopDown() {
    if(!meshRef.current || !cameraControllerRef.current) {
      return;
    }
    await cameraControllerRef.current.setPosition(0, 350, 0, true);

    //recenterCamera();
  }

  async function onAnimationEnd() {
     console.log("ended")
     recenterCamera();
  }

  function onAnimationStart() {
    console.log("started")
    //recenterCamera();
  }

  return (
      <Canvas
        camera={{ position: [0, 200, 250], fov: 75, far: 10000 }}
        dpr={Math.max(dpr, window.devicePixelRatio)}
        shadows
        className="rounded-xl hover:cursor-grabbing w-full h-full"
        id="three-js-renderer"
      >
        { import.meta.env.MODE === "development" ? <Stats/> : <></> }
        {/*<Stage adjustCamera={false} preset="soft" intensity={0} shadows="contact" environment={"warehouse"}>*/}
          <group scale={10} position={[-1500,-1150,-700]}>
            <Gltf src={`${BASE_URL}/stylized_workplace/scene.gltf`} rotation={[ 0, 0, 0]}/>
            {LAMP_LIGHTS.map((lamp) => (
              <group key={lamp.name} position={lamp.position}>
                <pointLight color="#ffcc99" intensity={isLight ? 1 : 3} decay={0} />
              </group>
            ))}
          </group>
          <PerformanceMonitor
              bounds={() => [30, 500]} // frame/second limit to trigger functions
              flipflops={1} // maximum changes before onFallback
              onDecline={() => {
                setDpr(dpr * 0.8); // lower dpr by 20%
              }}
          >
            <Scene
              shapes={shapes}
              meshRef={meshRef}
            />
          </PerformanceMonitor>
        {/*</Stage>*/}
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
          {/*<Grid scale={2} lineWidth={1}  blendFunction={BlendFunction.OVERLAY}/>*/}
          <TiltShift offset={0.30} focusArea={0.50} feather={0.5}  blendFunction={BlendFunction.NORMAL} />
          <ToneMapping  mode={ToneMappingMode.UNCHARTED2} />
        </EffectComposer>
        <CameraControls
          ref={cameraControllerRef}
          makeDefault
          smoothTime={1.0}
          minPolarAngle={0.75}
          maxPolarAngle={Math.PI / 2.5}
          minAzimuthAngle={-Math.PI/2.2}
          maxAzimuthAngle={Math.PI/10}
          minDistance={100}
          maxDistance={650}
        />
      </Canvas>
  );
}

export default ThreejsRenderer;
