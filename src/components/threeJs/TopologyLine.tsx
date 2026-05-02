import { Vector2, Vector3, BufferGeometry, Color } from 'three';
import { useMemo, type ReactElement } from 'react';
import { animated } from '@react-spring/three';
import TopologyMaterial from "./Material/TopologyMaterial";
import WavyPhysicalMaterial from './Material/WavyPhysicalMaterial';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { extend } from '@react-three/fiber'

extend({ MeshLineGeometry, MeshLineMaterial })

interface TopologyLineProps {
    points: Vector2[];
    color: Color;
		position?: [number, number, number];
    thickness?: number;
};

function TopologyLine({ points, color, position, thickness = 1 }: TopologyLineProps): ReactElement {
	const geometry = useMemo(() => {
    return new BufferGeometry().setFromPoints( points );
  },
  [points]
  );

  return (
    <animated.mesh
      position-x={position[0]}
      position-y={position[1]}
      position-z={position[2]}
    >
      <meshLineGeometry points={points} />
      <meshLineMaterial transparent lineWidth={thickness} color={color} dashArray={0.}  />
    </animated.mesh>
  );
};

export default TopologyLine;
