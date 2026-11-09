import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import CustomShaderMaterial from 'three-custom-shader-material'
import { Color, MeshPhysicalMaterial } from 'three';

interface WavyPhysicalMaterialProps {
  color: Color;
  roughness: number;
  metalness: number;
  amplitude? :number;
  frequency?: number;
}

const WavyPhysicalMaterial = ({ color, roughness, metalness, amplitude, frequency }: WavyPhysicalMaterialProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null);
  
  // Animation du temps
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  // Définition des uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uWaveAmplitude: { value: amplitude }, // Intensité de la vague
    uWaveFrequency: { value: frequency } // Fréquence des vagues
  }), [])

  return (
    <CustomShaderMaterial
      ref={materialRef}
      baseMaterial={MeshPhysicalMaterial}
      
      // Props physiques standards conservées
      color={color}
      roughness={roughness}
      metalness={metalness}
      clearcoat={1.0}
      clearcoatRoughness={0.1}
      
      uniforms={uniforms}
      
      vertexShader={`
        uniform float uTime;
        uniform float uWaveAmplitude;
        uniform float uWaveFrequency;

        void main() {
          float wave = sin(csm_Position.x  * uWaveFrequency + uTime);
          float oscillation = wave * uWaveAmplitude;

          vec2 directionXZ = normalize(csm_Position.xz);
          vec3 newPosition = csm_Position;
          newPosition.x += directionXZ.x * oscillation;
          newPosition.z += directionXZ.y * oscillation;

          csm_Position = newPosition;
          vNormal = csm_Normal;
        }

        `}
      
      fragmentShader={`
        void func1() {
            //csm_DiffuseColor = vec4(1.0, 0.0, 1.0, 1.0);
            //csm_Roughness == 0.5;
            //csm_Iridescence = 1.0;
            //csm_Emissive = vec3(1.0, 1.0, 1.0);
            //csm_Transmission = 0.5;
        }

        void main() {
          // func1();
          //csm_FragColor = vec4(vNormal, 1.0);
        }
      `}
    />
  )
};

export default WavyPhysicalMaterial;
