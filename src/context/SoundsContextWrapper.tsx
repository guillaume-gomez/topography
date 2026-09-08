import { createContext, type ReactNode, useMemo, useState } from 'react';
import useSound from 'use-sound';
import useRandomSound from "../hooks/useRandomSound";

const { BASE_URL } = import.meta.env;

export interface SoundsContextParams {
  playTopographyPieceSound: () => void;
  stopTopographyPieceSound: () => void;
  playChangeColorSound: () => void;
  playSubmitSound: () => void;
  hasSound: boolean;
  setHasSound: (hasSound: boolean) => void;
}
export const SoundsContext = createContext<SoundsContextParams>(null!);

interface Props {
  children: ReactNode;
}

function SoundsContextWrapper({children}: Props) {
  const [hasSound, setHasSound] = useState<boolean>(true);
  const { playRandomSound: playTopographyPieceSound, stopRandomSound: stopTopographyPieceSound } = useRandomSound([
    `${BASE_URL}/sounds/woods/1.mp3`,
    `${BASE_URL}/sounds/woods/2.mp3`,
    `${BASE_URL}/sounds/woods/3.mp3`,
    `${BASE_URL}/sounds/woods/4.mp3`,
    `${BASE_URL}/sounds/woods/5.mp3`,
    `${BASE_URL}/sounds/woods/6.mp3`,
    `${BASE_URL}/sounds/woods/7.wav`
  ], 0.5);
  const [playChangeColorSound] = useSound(`${BASE_URL}/sounds/freesound_community-paper-slide-89980.mp3`, { volume: 0.5 });
  const [playSubmitSound] = useSound(`${BASE_URL}/sounds/freesound_community-backpack-sound-96166.mp3`, { volume: .5 });

  const soundActions = useMemo(() => {
    const guard = (fn: () => void) => () => hasSound && fn();

    return {
      playTopographyPieceSound: guard(playTopographyPieceSound),
      stopTopographyPieceSound: guard(stopTopographyPieceSound),
      playChangeColorSound: guard(playChangeColorSound),
      playSubmitSound: guard(playSubmitSound),
    };
  }, [hasSound, playTopographyPieceSound, stopTopographyPieceSound, playChangeColorSound, playSubmitSound]);

  return (
    <SoundsContext value={{
      ...soundActions,
      hasSound,
      setHasSound
    }}>
      {children}
    </SoundsContext >
  );
}

export default SoundsContextWrapper;