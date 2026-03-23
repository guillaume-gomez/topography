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

  const [trails, api] = useTrail(
    COLORS.length,
    () => ({
      from: { opacity: 0, width: 0 },
      to: { opacity: 1, width: 200 },
      config: {
        duration: 200,
      }
    }),
    []
  )

	return (
    <div>
      <div class="grid grid-flow-col grid-rows-4 gap-4">
        {
          trails.map((props, index) => {
            const color = COLORS[index];
            return (
              <animated.button
                className="btn w-100 h-40 rounded-md"
                style={{
                  ...props,
                  background: color,
                  margin: isSelected(color) ? "2px" : "",
                  border: isSelected(color) ? `2px solid white` : ""
                }}
                onClick={() => setFrom(color)}
              >

              </animated.button>
            );
          })
        }
      </div>
      <div>
        <button
          className="btn btn-accent"
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