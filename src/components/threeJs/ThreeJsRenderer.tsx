import { useRef, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { type Mesh } from "three";
import { GizmoHelper, GizmoViewport, Stage, Stats, CameraControls } from '@react-three/drei';
import { EffectComposer, Bloom, /*Grid,*/ ToneMapping, TiltShift } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import Scene from "./Scene";
import { Shape } from "../hooks/useTopography";
import { SettingsContext } from "../SettingsContextWrapper";


const { /*BASE_URL,*/ MODE } = import.meta.env;

interface ThreeJsRendererProps {
  shapes: Shape[];
}

function ThreejsRenderer({ shapes } : ThreeJsRendererProps ): React.ReactElement {
  const {
    setAnimationState,
  } = useContext(SettingsContext);
  const cameraControllerRef = useRef<CameraControls>(null);
  const meshRef = useRef<Mesh|null>(null);
  
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
     recenterCamera();
     setAnimationState("ended")
  }

  function onAnimationStart() {
    recenterCamera();
  }

  return (
      <Canvas
        camera={{ position: [0, 200, 250], fov: 75, far: 750 }}
        dpr={window.devicePixelRatio}
        shadows
        className="rounded-xl hover:cursor-grabbing w-full h-full"
        id="three-js-renderer"
      >
        { import.meta.env.MODE === "development" ? <Stats/> : <></> }
        <ambientLight intensity={1.5} />
        <fog attach="fog" args={['red', 20, -5]} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <Stage adjustCamera={false} intensity={1} shadows="contact" environment={"park"}>
         <Scene
            shapes={shapes}
            meshRef={meshRef}
            onAnimationStart={onAnimationStart}
            onAnimationEnd={onAnimationEnd}
          />
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
          minAzimuthAngle={-Math.PI}
          maxAzimuthAngle={Math.PI}
          minDistance={10}
          maxDistance={400}
        />
      </Canvas>
  );
}

export default ThreejsRenderer;
