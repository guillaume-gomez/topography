import { createContext, useState, type ReactNode } from 'react';

export interface SettingsContextParams {
  hasSound: boolean;
  setHasSound: (sound: boolean) => void;
}
export const SoundContext = createContext<SettingsContextParams>(null);

interface Props {
  children: ReactNode;
}

function SoundContextWrapper({children}: Props) {
  const [hasSound, setHasSound] = useState<boolean>(true);

  return (
    <SoundContext value={{
      hasSound, setHasSound
    }}>
      {children}
    </SoundContext >
  );
}

export default SoundContextWrapper;