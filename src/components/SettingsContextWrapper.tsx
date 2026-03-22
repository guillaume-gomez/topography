import { createContext, useState, type ReactNode } from 'react';

type GenerationAnimationState = "started" | "ended";

export interface SettingsContextParams {
  isLight: boolean;
  setLight: (newLight: boolean) => void;
  width: number;
  height: number;
  numberOfLayers: number;
  timerSwitch: number;
  timerGeneration: number;
  animationState: GenerationAnimationState;
  setAnimationState: (status: GenerationAnimationState ) => void;
}
export const SettingsContext = createContext<SettingsContextParams>(null);

interface Props {
  children: ReactNode;
}

function SettingsContextWrapper({children}: Props) {
  const [isLight, setLight] = useState<boolean>(false);
  const [width, _setWidth] = useState<number>(250);
  const [height, _setHeight] = useState<number>(250);
  const [numberOfLayers, _setNumberOfLayers] = useState<number>(10);
  const [animationState, setAnimationState] = useState<GenerationAnimationState>("ended");

  return (
    <SettingsContext value={{
      isLight, setLight,
      timerSwitch: 2000,
      timerGeneration: 5000,
      animationState, setAnimationState,
      width,
      height,
      numberOfLayers
    }}>
      {children}
    </SettingsContext >
  );
}

export default SettingsContextWrapper;