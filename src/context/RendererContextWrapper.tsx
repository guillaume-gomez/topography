import { createContext, useState, useMemo, type ReactNode } from 'react';
import useGrid, { type Grid } from "../hooks/useGrid";

export type GenerationAnimationState = "started" | "ended";

export interface RendererContextParams {
  isLight: boolean;
  setLight: (newLight: boolean) => void;
  timerSwitch: number;
  timerGeneration: number;
  animationState: GenerationAnimationState;
  setAnimationState: (status: GenerationAnimationState ) => void;
  enableBloom: boolean;
  setEnableBloom: (bloom: boolean) => void;
  hasSingleTopograhy: boolean;
  generationName: string;
  grid: Grid;
  regenerateGrid: () => void;
  width: number;
  height: number;
}
export const RendererContext = createContext<RendererContextParams>(null!);

interface Props {
  children: ReactNode;
}


const BASE_TERRAIN = 500;

function RendererContextWrapper({children}: Props) {
  const [isLight, setLight] = useState<boolean>(true);
  const [animationState, setAnimationState] = useState<GenerationAnimationState>("ended");
  const [enableBloom, setEnableBloom] = useState<boolean>(true);
  const [hasSingleTopograhy, ] = useState<boolean>(false);
  const [generationName, _setGenerationName] = useState<string>("Guillaume Gomez");
  const { grid, call: regenerateGrid } = useGrid({filepath: "volcano.json", typeOfFile: "noise" });

  const { width, height } = useMemo(() => {
    if(hasSingleTopograhy) {
      return { width: BASE_TERRAIN, height: BASE_TERRAIN };
    } else {
      const ratio = parseFloat((grid.gridWidth/grid.gridHeight).toFixed(2));
      return { width: BASE_TERRAIN * ratio, height: BASE_TERRAIN };
    }
  }, [grid, hasSingleTopograhy]);

  return (
    <RendererContext value={{
      isLight, setLight,
      timerSwitch: 2000,
      timerGeneration: 4000,
      animationState, setAnimationState,
      enableBloom, setEnableBloom,
      hasSingleTopograhy,
      generationName,
      grid,
      regenerateGrid,
      width,
      height,
    }}>
      {children}
    </RendererContext >
  );
}

export default RendererContextWrapper;
