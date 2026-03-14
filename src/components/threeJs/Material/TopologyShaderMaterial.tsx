import { shaderMaterial } from "@react-three/drei";
import { Vector2, Color } from "three";


const TopologyShaderMaterial = shaderMaterial(
  { 
    uTime: 1.0,
    uColor: new Color()
  },
  // vertex shader
    /*glsl*/`
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.x = sin(uTime) * pos.x;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // fragment shader
    /*glsl*/`
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;

    void main() {
        gl_FragColor = vec4(uColor, 1.0);
    }
  `
)

export default TopologyShaderMaterial;


