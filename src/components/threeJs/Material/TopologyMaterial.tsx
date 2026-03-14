import { useRef } from "react"; 
import { Vector2, type ShaderMaterial, Color } from "three";
import { extend, useFrame } from "@react-three/fiber";
import TopologyShaderMaterial from "./TopologyShaderMaterial";

const TopologyMaterialComponent = extend(TopologyShaderMaterial);

interface TopologyMaterialProps {
	color: Color;
}

function TopologyMaterial({width, height, mousePosition, color} : TopologyMaterialProps) {
  const ref = useRef<ShaderMaterial>(null);
  
  useFrame((state) => {
    const { clock } = state;
    if(!ref || !ref.current) {
      return;
    }
    ref.current.uniforms.uTime.value = clock.getElapsedTime();
  });

	return <TopologyMaterialComponent
    ref={ref}
		uTime={1.0}
		uColor={color}
		/>
}

export default TopologyMaterial;