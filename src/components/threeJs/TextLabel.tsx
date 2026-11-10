import { useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

type Anchor = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface TextLabelProps {
  text: string;
  width?: number;
  height?: number;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  // Which point of the label "position" refers to. Lets a parent anchor the
  // label to a corner (e.g. a box edge) without knowing its width/height.
  anchor?: Anchor;
}

function TextLabel({
  text,
  width = 4,
  height = 1,
  fontSize = 64,
  color = "#ffffff",
  backgroundColor = "transparent",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  anchor = "center",
}: TextLabelProps) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512 * (height / width);

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const maxTextWidth = canvas.width * 0.9;
    let currentFontSize = fontSize;
    ctx.font = `bold ${currentFontSize}px sans-serif`;
    while (ctx.measureText(text).width > maxTextWidth && currentFontSize > 8) {
      currentFontSize -= 2;
      ctx.font = `bold ${currentFontSize}px sans-serif`;
    }

    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }, [text, width, height, fontSize, color, backgroundColor]);

  // Offset the mesh (in its own pre-rotation space) so that "position" lands
  // on the requested corner instead of the label's center.
  const offsetX = anchor.endsWith("left") ? width / 2 : anchor.endsWith("right") ? -width / 2 : 0;
  const offsetY = anchor.startsWith("top") ? -height / 2 : anchor.startsWith("bottom") ? height / 2 : 0;

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[offsetX, offsetY, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
    </group>
  );
};

export default TextLabel;
