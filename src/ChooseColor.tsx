import { useState } from "react";
import { useTrail, animated } from '@react-spring/web'


interface ChooseColorProps {
  onSubmit: (colorFrom: string, colorTo: string) => void;	
}

const COLORS = [
  "#D36135",
  "#7FB069",
  "#ECE4B7",
  "#E6AA68",
  "#EB5E55",
  "#C6D8D3",
  "#73937E",
  "#471323",
  "#5B2E48",
  "#DEB841",
  "#DE9E36",
  "#F4442E",
  "#BC5F04",
  "#FFA552",
  "#63C132",
  "#358600",
  "#9EE37D",
  "#274690",
  "#576CA8",
  "#DE541E",
  "#FF9FE5",
  "#FF858D"
]

function ChooseColor({onSubmit} : ChooseColorProps) {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  function isSelected(color: string): boolean {
    return from === color || to == color;
  }

  function onClick(color: string) {
    // unToggle
    if(from === color) {
      setFrom("");
      return;
    }
    // unToggle
    if(to === color) {
      setTo("");
      return;
    }

    if(from !== "") {
      setTo(color);
      return;
    }
    setFrom(color)
  }

  function computeLabel(color: string): string {
    if(from === color) {
      return "First color";
    }

    if(to === color) {
      return "Last color";
    }

    return "";
  }

  const [trails, api] = useTrail(
    COLORS.length,
    () => ({
      from: { opacity: 0, height: 0,  },
      to: { opacity: 1, height: 100, },
      config: {
        duration: 200
      }
    }),
    []
  )

	return (
    <div className="flex flex-col gap-2">
      <p className="self-center text-2xl">Pick two colours</p>
      <div className="grid grid-flow-row xl:grid-cols-8 md:grid-cols-6 grid-cols-4 gap-2">
        {
          trails.map((props, index) => {
            const color = COLORS[index];
            return (
              <animated.button
                className="btn h-40 rounded-md"
                style={{
                  ...props,
                  background: color,
                }}
                onClick={() => onClick(color)}
                key={color}
              >
                <span className="mix-blend-difference text-2xl">{computeLabel(color)}</span>
              </animated.button>
            );
          })
        }
      </div>
      <div>
        <button
          className="btn btn-lg btn-primary"
          disabled={from === "" || to === ""}
          onClick={() => onSubmit(from, to)}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default ChooseColor;