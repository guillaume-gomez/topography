import { useState, useEffect, useContext } from "react";
import { useTrail, animated } from '@react-spring/web';
import ColorInput from "./components/ColorInput";
import NumberInput from "./components/NumberInput";
import Card from "./components/Card";
import { lerpColors, rgbToHex } from "./colorUtils";
import { sample } from "lodash";
import { SoundsContext } from "./context/SoundsContextWrapper";

interface ChooseColorProps {
  onSubmit: (colorFrom: string, colorTo: string, layers: number) => void;
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

function ChooseColor({ onSubmit } : ChooseColorProps) {
  const [colors, setColors] = useState<string[]>([]);
  const [from, setFrom] = useState<string>("#006400");
  const [to, setTo] = useState<string>("#A0522D");
  const [layers, setLayers] = useState<number>(5);
  
  const {
    playSubmitSound,
    playChangeColorSound
  } = useContext(SoundsContext);

  const [trails,] = useTrail(
    layers,
    (index) => ({
      from: { opacity: 0, height: 0, },
      to: async (next) => {
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
      onStart: () => {
        if(index === 0) {
          playChangeColorSound();
        }
      }
    }),
    [layers]
  );

  useEffect(() => {
    const rgbColors = lerpColors(from, to, layers);
    setColors(rgbColors.map(rgbColor => rgbToHex(rgbColor)));
  }, [from, to, layers]);

  function randomColors() {
    const colorFrom = sample(COLORS) as string;
    const colorTo = sample(COLORS) as string;
    setFrom(colorFrom);
    setTo(colorTo);
  }

  function submit() {
    onSubmit(from, to, layers);
    playSubmitSound();
  }

	return (
    <div className="flex flex-col gap-2">
      <p className="self-center text-3xl">Pick two colours</p>
      <Card>
        <div className="flex flex-row gap-1 items-end h-100" style={{minHeight: "50vh"}}>
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
          <NumberInput
              label="Layers"
              onChange={(newValue) => setLayers(newValue)}
              value={layers}
              min={5}
              max={15}
              size={"input-md"}
            />
          <button
            className="btn btn-soft btn-secondary"
            onClick={randomColors}
          >
            Random colors
          </button>
          <button
            className="btn btn-lg btn-primary"
            disabled={from === "" || to === ""}
            onClick={submit}
          >
            Submit
          </button>
        </div>
      </Card>
    </div>
  );
}

export default ChooseColor;