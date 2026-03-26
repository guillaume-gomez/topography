import { useState, useEffect } from "react";
import { useTrail, animated } from '@react-spring/web';
import ColorInput from "./components/ColorInput";
import Range from "./components/Range";
import Card from "./components/Card";
import { lerpColors, rgbToHex } from "./colorUtils";

interface ChooseColorProps {
  onSubmit: (colorFrom: string, colorTo: string) => void;
}

function ChooseColor({onSubmit} : ChooseColorProps) {
  const [from, setFrom] = useState<string>("#333333");
  const [to, setTo] = useState<string>("#FFFFFF");
  const [layers, setLayers] = useState<number>(5);
  const [colors, setColors] = useState<string[]>([]);

  const [trails, api] = useTrail(
    layers,
    (index) => ({
      from: { opacity: 0, height: 0,  },
      to: async (next, _cancel) => {
            const minHeight = 20; // 20%
            const height = Math.sin(Math.PI * index/layers) * 100;
            await next(
              { 
                opacity: 1,
                height: Math.max(minHeight, height),
                config: { duration: 250 }
              }
            );
            await next(
              { 
                opacity: 1,
                height: 100,
                delay: 200,
              }
            );
          },
      reset: true,
    }),
    [layers]
  );

  useEffect(() => {
    const rgbColors = lerpColors(from, to, layers);
    setColors(rgbColors.map(rgbColor => rgbToHex(rgbColor)));
  }, [from, to, layers]);

  function randomColors() {

  }

	return (
    <div className="flex flex-col gap-2 p-5">
      <p className="self-center text-3xl">Pick two colours</p>
      <Card>
        <div className="flex flex-row gap-1 items-end h-100">
          {
            trails.map((props, index) => {
              const color = colors[index];
              return (
                <animated.div
                  className="w-100 h-100 rounded-md border border-black"
                  style={{
                    opacity: props.opacity,
                    height: props.height.to(v => v + "%"),
                    background:color,
                    transformOrigin: "50% 100%",
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
          <button
            className="btn btn-secondary"
            onClick={randomColors}
          >
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