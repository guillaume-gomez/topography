import { useCallback, useMemo, useRef } from 'react';
import { Howl } from 'howler';

function useRandomSound(soundPaths: string[], volume = 0.5) {
  const sounds = useMemo(
    () => soundPaths.map((path) => new Howl({ src: [path], volume })),
    [soundPaths, volume]
  );

  const soundIndex = useRef<number>(0);

  const playRandomSound = useCallback(() => {
    if (sounds.length === 0) {
      return;
    }
    const index = Math.floor(Math.random() * sounds.length);
    soundIndex.current = index;

    sounds[index].play();
  }, [sounds]);

  const stopRandomSound = useCallback(() => {
    sounds[soundIndex.current].stop();
  }, [sounds])

  return { playRandomSound, stopRandomSound };
}

export default useRandomSound;