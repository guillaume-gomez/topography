import { createContext, type ReactNode } from 'react';
import useSound from 'use-sound';


export interface SoundsContextParams {
  playTopographyPieceSound: () => void;
  stopTopographyPieceSound: () => void;
  playChangeColorSound: () => void;
  playSubmitSound: () => void;
}
export const SoundsContext = createContext<SoundsContextParams>(null);

interface Props {
  children: ReactNode;
}

function SoundsContextWrapper({children}: Props) {
  const [playTopographyPieceSound, { stop: stopTopographyPieceSound }] = useSound('/sounds/44062__feegle__gamepiece.wav', { volume: 1. });
  const [playChangeColorSound] = useSound('/sounds/freesound_community-paper-slide-89980.mp3', { volume: .5 });
  const [playSubmitSound] = useSound('/sounds/freesound_community-backpack-sound-96166.mp3', { volume: .5 });

  
  return (
    <SoundsContext value={{
      playTopographyPieceSound,
      stopTopographyPieceSound,
      playChangeColorSound,
      playSubmitSound
    }}>
      {children}
    </SoundsContext >
  );
}

export default SoundsContextWrapper;