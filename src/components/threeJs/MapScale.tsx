import { useMemo, useContext } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { lerpColors, rgbToHex } from "../../colorUtils";
import { SettingsContext } from "../../context/SettingsContextWrapper";

interface MapScaleProps {
  color?: string;
  backgroundColor?: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

const Width = 512;
const Height = 64;


function MapScale({
  color = "#ffffff",
  backgroundColor = "transparent",
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}: MapScaleProps) {

  const {
    colorFrom,
    colorTo,
    numberOfLayers
  } = useContext(SettingsContext);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = Width;
    canvas.height = Height;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const stripeWidth = canvas.width/numberOfLayers;

    const colors = lerpColors(colorFrom, colorTo, numberOfLayers);
    for(let index = 0; index < numberOfLayers; index++) {
      ctx.fillStyle = rgbToHex(colors[index]);
      console.log(ctx.fillStyle)
      ctx.fillRect(stripeWidth * index, 0, stripeWidth, canvas.height);
    }
    
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, [color, backgroundColor, colorFrom, colorTo]);

  return (
    <group position={position} rotation={rotation}>
      <mesh scale={0.35}>
        <planeGeometry args={[Width, Height]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
    </group>
  );
};

export default MapScale;
