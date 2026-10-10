import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, ToneMapping, TiltShift } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing';

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 75 }}>
      <color attach="background" args={['#111']} />
      <ambientLight />
      {/*<EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} levels={10} intensity={0.5 * 4} />
        <ToneMapping />
      </EffectComposer>*/}
      
      <Shape color="#abe2ab" position={[-2, 0, 0]}>
        <planeGeometry args={[1.5, 1.5]} />
      </Shape>
      <Shape color="orange" position={[0, -0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <circleGeometry args={[1, 1]} />
      </Shape>
      <Shape color="hotpink" position={[2, 0, 0]}>
        <circleGeometry args={[0.8, 64]} />
      </Shape>
      <EffectComposer enableNormalPass={false}>
         
        <TiltShift offset={0.30} focusArea={0.50} feather={0.5} blendFunction={BlendFunction.NORMAL} />
          <ToneMapping  mode={ToneMappingMode.UNCHARTED2} />
          <Bloom mipmapBlur luminanceThreshold={1} levels={10} intensity={0.5 * 4} />
      </EffectComposer>
      {/*<CameraControls
          makeDefault
          smoothTime={1.0}
        />*/}
    </Canvas>
  )
}

function Shape({ children, color, ...props }) {
  const [hovered, hover] = useState(true)
  return (
    <mesh {...props} onPointerOver={() => hover(false)} onPointerOut={() => hover(true)}>
      {children}
      {/* In order to get selective bloom we must crank colors out of
        their 0-1 spectrum. We push them way oupt of range. What previously was [1, 1, 1] now could
        for instance be [10, 10, 10]. */}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={!hovered ? 4 : 0} />
    </mesh>
  )
}
