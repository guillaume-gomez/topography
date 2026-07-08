import { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../context/SettingsContextWrapper";
import { lerpColors, rgbToHex } from "../colorUtils";
import Card from "./Card";

function Legend() {
  const {
    numberOfLayers,
    colorFrom, 
    colorTo
  } = useContext(SettingsContext);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const rgbColors = lerpColors(colorFrom, colorTo, numberOfLayers);
    setColors(rgbColors.map(rgbColor => rgbToHex(rgbColor)));
  }, [colorFrom, colorTo, numberOfLayers]);

  
	return (
    <Card
        kustomClass="absolute right-2 lg:right-5 bottom-2 lg:bottom-5 z-10 opacity-70"
        kustomClassBody="p-1"
      >
      <div className="flex flex-col gap-2" style={{ maxWidth: 200 }}>
        <div className="flex flex-row">
          {
            colors.map((color, index) => {
              return (
                <div
                  className="w-100 rounded-md border border-black"
                  style={{
                    background:color,
                    height: 20
                  }}
                  key={index}
                >
                </div>
              );
            })
          }
        </div>
        <div className="flex flex-row justify-between">
          <span className="font-bold">
            0
          </span>
          <span className="font-bold">
            100
          </span>
        </div>
      </div>
    </Card>
  );
}

export default Legend;