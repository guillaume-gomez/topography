import { createContext, useState, type ReactNode } from 'react';

export interface SettingsContextParams {
  isLight: boolean;
  setLight: (newLight: boolean) => void;
  width: number;
  height: number;
  numberOfLayers: number;
  timerIntroInMs: number;
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

  return (
    <SettingsContext value={{
      isLight, setLight,
      timerSwitch: 2000,
      width,
      height,
      numberOfLayers
    }}>
      {children}
    </SettingsContext >
  );
}

export default SettingsContextWrapper;