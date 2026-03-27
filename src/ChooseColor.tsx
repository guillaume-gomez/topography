import { useState, useEffect, useContext } from "react";
import { useTrail, animated } from '@react-spring/web';
import ColorInput from "./components/ColorInput";
import Range from "./components/Range";
import Card from "./components/Card";
import { lerpColors, rgbToHex } from "./colorUtils";
import { SettingsContext } from "./components/SettingsContextWrapper";
import { sample } from "lodash";

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
  "#FF858D",
]

function ChooseColor({onSubmit} : ChooseColorProps) {
  const [colors, setColors] = useState<string[]>([]);
  const {
    colorFrom,
    colorTo,
    setColorFrom,
    setColorTo,
    numberOfLayers,
    setNumberOfLayers,
    timerSwitch,
  } = useContext(SettingsContext);


  const [trails, api] = useTrail(
    numberOfLayers,
    (index) => ({
      from: { opacity: 0, height: 0,  },
      to: async (next, _cancel) => {
            const minHeight = 20; // 20%
            const height = Math.sin(Math.PI * index/numberOfLayers) * 100;
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
    [numberOfLayers]
  );

  useEffect(() => {
    const rgbColors = lerpColors(colorFrom, colorTo, numberOfLayers);
    setColors(rgbColors.map(rgbColor => rgbToHex(rgbColor)));
  }, [colorFrom, colorTo, numberOfLayers]);

  function randomColors() {
    const colorFrom = sample(COLORS);
    const colorTo = sample(COLORS);
    setColorFrom(colorFrom);
    setColorTo(colorTo);
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
            value={colorFrom}
            onChange={(newColor) => setColorFrom(newColor)}
          />
          <ColorInput
            label={"End Color"}
            value={colorTo}
            onChange={(newColor) => setColorTo(newColor)}
          />
          <Range
              label="Layers"
              onChange={(newValue) => setNumberOfLayers(newValue)}
              value={numberOfLayers}
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
            disabled={colorFrom === "" || colorTo === ""}
            onClick={() => onSubmit(colorFrom, colorTo)}
          >
            Submit
          </button>
        </div>
      </Card>
    </div>
  );
}

export default ChooseColor;