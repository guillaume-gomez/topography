import { Vector2, Shape } from 'three';
import { useMemo, type ReactElement } from 'react';

interface TopologyShapeProps {
    points: Vector2[];
    color: string;
		position?: [number, number, number];
    height?: number
};

function TopologyShape({ points, color, position, height }: TopologyShapeProps): ReactElement {
	const shape = useMemo(() => new Shape(points), [points]);
	const extrudeSettings = useMemo(() => ({
		depth: height,
		bevelEnabled: false,
	}), []);

  return (
    <mesh	position={position} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <extrudeGeometry attach="geometry" args={[shape, extrudeSettings]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default TopologyShape;
