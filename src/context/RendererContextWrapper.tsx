import { createContext, useState, useMemo, type ReactNode } from 'react';

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

  return (
    <RendererContext value={{
      isLight, setLight,
      timerSwitch: 2000,
      timerGeneration: 4000,
      animationState, setAnimationState,
      enableBloom, setEnableBloom,
      hasSingleTopograhy,
      generationName,
    }}>
      {children}
    </RendererContext >
  );
}

export default RendererContextWrapper;
