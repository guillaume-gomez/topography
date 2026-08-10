import { useRef, useContext, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { type Mesh } from "three";
import { GizmoHelper, GizmoViewport, Stage, Stats, CameraControls, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, /*Grid,*/ ToneMapping, TiltShift } from '@react-three/postprocessing';
import CameraControlsImpl from 'camera-controls';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import Scene from "./Scene";
import { type Shape } from "../hooks/useTopography";
import { SettingsContext } from "../../context/SettingsContextWrapper";


const { /*BASE_URL,*/ MODE } = import.meta.env;

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
  const [dpr, setDpr] = useState<number>(() => window.devicePixelRatio);
  const [optimized, setOptimized] = useState<boolean>(false);

  useEffect(() => {
    if (!cameraControllerRef.current) return;
    //disable pan on mobile
    cameraControllerRef.current.touches.two = CameraControlsImpl.ACTION.TOUCH_DOLLY; // garde le zoom, retire le pan
    cameraControllerRef.current.touches.three = CameraControlsImpl.ACTION.NONE; // désactive complètement
  }, [cameraControllerRef.current]);

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
        camera={{ position: [0, 200, 250], fov: 75, far: 1500 }}
        dpr={Math.min(dpr, window.devicePixelRatio)}
        shadows
        className="rounded-xl hover:cursor-grabbing w-full h-full"
        id="three-js-renderer"
      >
        { import.meta.env.MODE === "development" ? <Stats/> : <></> }
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <PerformanceMonitor
            bounds={() => [30, 500]} // frame/second limit to trigger functions
            flipflops={1} // maximum changes before onFallback
            onDecline={() => {
              setDpr((currentDpr) => Math.max(0.5, currentDpr * 0.8)); // lower dpr by 20%
              onOptimizedChange(true);
            }}
            onIncline={() => {
              setDpr((currentDpr) => Math.min(window.devicePixelRatio, currentDpr * 1.2));
              onOptimizedChange(false);
            }}
        >
          <Stage adjustCamera={false} intensity={1} shadows="contact" environment={"park"}>
            <Scene
              shapes={shapes}
              meshRef={meshRef}
              optimized={optimized}
            />
          </Stage>
        </PerformanceMonitor>
        { MODE === "development" &&
          <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>
        }
        <EffectComposer enableNormalPass={false}>
          <Bloom mipmapBlur={!optimized} luminanceThreshold={1.0} />
          { !optimized && 
            <TiltShift offset={0.30} focusArea={0.50} feather={0.5}  blendFunction={BlendFunction.NORMAL} />
          }
          <ToneMapping  mode={ToneMappingMode.UNCHARTED2} />
        </EffectComposer>
        <CameraControls
          ref={cameraControllerRef}
          makeDefault
          smoothTime={1.0}
          minPolarAngle={0.75}
          maxPolarAngle={Math.PI / 2.5}
          minAzimuthAngle={-Math.PI}
          maxAzimuthAngle={Math.PI}
          minDistance={200}
          maxDistance={800}
        />
      </Canvas>
  );
}

export default ThreejsRenderer;
