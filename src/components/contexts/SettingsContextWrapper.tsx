import { createContext, useState, type ReactNode } from 'react';

type GenerationAnimationState = "started" | "ended";

export interface SettingsContextParams {
  isLight: boolean;
  setLight: (newLight: boolean) => void;
  width: number;
  height: number;
  numberOfLayers: number;
  setNumberOfLayers: (layers: number) => void;
  timerSwitch: number;
  timerGeneration: number;
  animationState: GenerationAnimationState;
  setAnimationState: (status: GenerationAnimationState ) => void;
  colorFrom: string;
  setColorFrom: (color: string) => void;
  colorTo: string;
  setColorTo: (color: string) => void;
  colorChosen: boolean;
  setColorChosen: (chosen: boolean) => void;
}
export const SettingsContext = createContext<SettingsContextParams>(null);

interface Props {
  children: ReactNode;
}

function SettingsContextWrapper({children}: Props) {
  const [isLight, setLight] = useState<boolean>(true);
  const [width, _setWidth] = useState<number>(500);
  const [height, _setHeight] = useState<number>(500);
  const [numberOfLayers, setNumberOfLayers] = useState<number>(7);
  const [colorFrom, setColorFrom] = useState<string>("");
  const [colorTo, setColorTo] = useState<string>("");
  const [animationState, setAnimationState] = useState<GenerationAnimationState>("ended");
  const [colorChosen, setColorChosen] = useState<boolean>(false);

  return (
    <SettingsContext value={{
      isLight, setLight,
      timerSwitch: 2000,
      timerGeneration: 4000,
      animationState, setAnimationState,
      width,
      height,
      numberOfLayers, setNumberOfLayers,
      colorFrom, setColorFrom,
      colorTo, setColorTo,
      colorChosen, setColorChosen,
    }}>
      {children}
    </SettingsContext >
  );
}

export default SettingsContextWrapper;