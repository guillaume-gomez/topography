import { Vector2, Vector3, Shape, Color } from 'three';
import { useMemo, type ReactElement } from 'react';
import { animated } from '@react-spring/three';
import TopologyMaterial from "./Material/TopologyMaterial";
import WavyPhysicalMaterial from './Material/WavyPhysicalMaterial';


interface TopologyShapeProps {
    points: Vector2[];
    color: Color;
		position?: [number, number, number];
    thickness?: number;
};

function TopologyShape({ points, color, position, thickness }: TopologyShapeProps): ReactElement {
	const shape = useMemo(() => {
    return new Shape(points);
  },
  [points]
  );

	const extrudeSettings = useMemo(() => ({
		depth: thickness,
		bevelEnabled: true,
    bevelThickness: thickness * 0.5,
    bevelSize: thickness * 0.5,
    bevelOffset: 0,
    bevelSegments: 10
	}), []);
  return (
    <animated.mesh
      position-x={position[0]}
      position-y={position[1]}
      position-z={position[2]}
      castShadow
      receiveShadow

    >
      <animated.extrudeGeometry attach="geometry" args={[shape, extrudeSettings]} />
      {/*<WavyPhysicalMaterial 
        color={color}
        emissive={"black"}
        roughness={1.}
        metalness={0.1}
        amplitude={4}
        frequency={10}
      />*/}
      
      <meshPhysicalMaterial
        wireframe={false}
        color={color}
        emissive={"black"}
        roughness={1}
        metalness={0.1}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
      />
      {/*<meshNormalMaterial/>*/}
    </animated.mesh>
  );
};

export default TopologyShape;
