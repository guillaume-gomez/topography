import { Vector2, Color } from 'three';
import { type ReactElement } from 'react';
import { animated } from '@react-spring/three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { extend } from '@react-three/fiber'


extend({ MeshLineGeometry });

const MeshLineMaterialComponent = extend(MeshLineMaterial);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MeshLineMaterialAnimated = animated(MeshLineMaterialComponent) as any


interface TopologyLineProps {
    points: Vector2[];
    color: Color;
		position: [number, number, number];
    thickness?: number;
    opacity?: number;
};

function TopologyLine({ points, color, position, thickness = 1, opacity }: TopologyLineProps): ReactElement {
  return (
    <animated.mesh
      position-x={position[0]}
      position-y={position[1]}
      position-z={position[2]}
      visible={opacity.to(v => v > 0.001)}
    >
      <meshLineGeometry points={points} />
      <MeshLineMaterialAnimated
        transparent
        lineWidth={thickness}
        color={color}
        dashArray={0.}
        opacity={opacity}
      />
    </animated.mesh>
  );
};

export default TopologyLine;