import { useState, useEffect } from "react";
import { useTrail, animated } from '@react-spring/web';
import ColorInput from "./components/ColorInput";
import Range from "./components/Range";
import Card from "./components/Card";
import { lerpColors, rgbToHex } from "./colorUtils";

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
  const [from, setFrom] = useState<string>("#000000");
  const [to, setTo] = useState<string>("#FFFFFF");
  const [layers, setLayers] = useState<number>(5);
  const [colors, setColors] = useState<string[]>([]);

  const [trails, api] = useTrail(
    layers,
    () => ({
      from: { opacity: 0, height: 0,  },
      to: { opacity: 1, height: 100, },
      config: {
        duration: 200
      }
    }),
    [layers]
  );

  useEffect(() => {
    const rgbColors = lerpColors(from, to, layers);
    setColors(rgbColors.map(rgbColor => rgbToHex(rgbColor)));

  }, [from, to, layers]);

	return (
    <div className="flex flex-col gap-2 p-5">
      <p className="self-center text-2xl">Pick two colours</p>
      <Card>
        <div className="flex flex-row gap-0">
          {
            trails.map((props, index) => {
              const color = colors[index];
              return (
                <animated.div
                  className="w-100 h-100 rounded-md"
                  style={{
                    opacity: props.opacity,
                    height: `${props.height}%`,
                    background:color
                  }}
                  key={index}
                >
                </animated.div>
              );
            })
          }
        </div>
      </Card>
      <Card>
        <div className="flex md:flex-row flex-col items-center justify-between">
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
              max={15}
              size={"range-normal"}
            />
          <button className="btn btn-secondary">
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