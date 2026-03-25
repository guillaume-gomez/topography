import { useState } from "react";
import { useTrail, animated } from '@react-spring/web';
import ColorInput from "./components/ColorInput";
import Range from "./components/Range";
import Card from "./components/Card";

interface ChooseColorProps {
  onSubmit: (colorFrom: string, colorTo: string) => void;	
}

const COLORS = [
  { background: "#D36135", textColor: "black"},
  { background: "#7FB069", textColor: "black"},
  { background: "#ECE4B7", textColor: "black"},
  { background: "#E6AA68", textColor: "black"},
  { background: "#EB5E55", textColor: "black"},
  { background: "#C6D8D3", textColor: "black"},
  { background: "#73937E", textColor: "black"},
  { background: "#471323", textColor: "black"},
  { background: "#5B2E48", textColor: "black"},
  { background: "#DEB841", textColor: "black"},
  { background: "#DE9E36", textColor: "black"},
  { background: "#F4442E", textColor: "black"},
  { background: "#BC5F04", textColor: "black"},
  { background: "#FFA552", textColor: "black"},
  { background: "#63C132", textColor: "black"},
  { background: "#358600", textColor: "black"},
  { background: "#9EE37D", textColor: "black"},
  { background: "#274690", textColor: "black"},
  { background: "#576CA8", textColor: "black"},
  { background: "#DE541E", textColor: "black"},
  { background: "#FF9FE5", textColor: "black"},
  { background: "#FF858D", textColor: "black"},
]

function ChooseColor({onSubmit} : ChooseColorProps) {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [layers, setLayers] = useState<number>(5);

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
            const { background, textColor } = COLORS[index];
            return (
              <animated.button
                className="btn h-40 rounded-md"
                style={{
                  ...props,
                  background
                }}
                onClick={() => onClick(background)}
                key={background}
              >
                <span
                  className="text-2xl"
                  style={{color: textColor}}
                >
                  {computeLabel(background)}
                </span>
              </animated.button>
            );
          })
        }
      </div>
      <Card>
        <div className="flex md:flex-row flex-col content-center justify-between">
          <ColorInput
            label={"Start Color"}
            value={from}
            onChange={(newColor) => setFrom(newColor)}
          />
          <ColorInput
            label={"End Color"}
            value={to}
            onChange={(newColor) => setTo(newColor)}
          />
          <Range
              label="Layers"
              onChange={(newValue) => setLayers(newValue)}
              value={layers}
              min={5}
              max={30}
            />
          <button>
            Random colors
          </button>
          <button
            className="btn btn-lg btn-primary"
            disabled={from === "" || to === ""}
            onClick={() => onSubmit(from, to)}
          >
            Submit
          </button>
        </div>
      </Card>
    </div>
  );
}

export default ChooseColor;