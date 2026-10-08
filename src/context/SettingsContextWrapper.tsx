import { createContext, useState, type ReactNode } from 'react';

export interface SettingsContextParams {
  numberOfLayers: number;
  setNumberOfLayers: (layers: number) => void;
  colorFrom: string;
  setColorFrom: (color: string) => void;
  colorTo: string;
  setColorTo: (color: string) => void;
  colorChosen: boolean;
  setColorChosen: (chosen: boolean) => void;
}
export const SettingsContext = createContext<SettingsContextParams>(null!);

interface Props {
  children: ReactNode;
}

function SettingsContextWrapper({children}: Props) {
  const [numberOfLayers, setNumberOfLayers] = useState<number>(7); // expected number of layers
  const [colorFrom, setColorFrom] = useState<string>("#abe2ab");
  const [colorTo, setColorTo] = useState<string>("#742906");
  const [colorChosen, setColorChosen] = useState<boolean>(false);

  return (
    <SettingsContext value={{
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
