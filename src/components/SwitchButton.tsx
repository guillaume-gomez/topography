import { useState } from "react";
import { useSpring, animated } from '@react-spring/web';

interface SwitchButtonProps {
  onClick: () => void;
}

function SwitchButton({ onClick }: SwitchButtonProps) {
  const [hover, setHover] = useState<boolean>(true);
  const propsUp = useSpring(
    { d: hover ?
      "M 8,10 L 22,10 M 22,10 L 16, 6 M 22, 10 L 16, 14" :
      "M 14,10 L 28,10 M 28,10 L 22, 6 M 28, 10 L 22, 14"
      
    }
  )
  const propsDown = useSpring(
    { d: hover ? 
      "M 22, 22 L 8, 22 M 8, 22 L 14, 18 M 8, 22 L 14, 26 M 8, 22" :
      "M 16, 22 L 2, 22 M 2, 22 L 8, 18 M 2, 22 L 8, 26 M 2, 22"
    }
  )

  return (
    <button
      className="btn btn-sm btn-soft btn-accent"
      onClick={onClick}
      onMouseEnter={() => setHover(false)}
      onMouseLeave={() => setHover(true)}
    >
      <svg viewBox="0 0 32 32"
        width={24}
        height={24}
      >
        <animated.path
          style={{
              stroke: "currentColor",
            }}
          d={propsUp.d}
        />
        <animated.path
          style={{
              stroke: "currentColor",
            }}
          d={propsDown.d}
        />
      </svg>
      Switch Color
    </button>
  );
}

export default SwitchButton;