import { useContext } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { SoundContext } from "./contexts/SoundContextWrapper";

function ToggleSoundButton() {
  const {
    hasSound,
    setHasSound,
  } = useContext(SoundContext);

  const toggleSoundButtonProps = useSpring({
    stroke: "white",
    strokeWidth: "2px",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d1: hasSound ? "M12.5493 4.50005C11.3193 4.04005 8.70926 5.49996 6.54926 7.40996H4.94922C3.88835 7.40996 2.87093 7.83145 2.12079 8.58159C1.37064 9.33174 0.949219 10.3491 0.949219 11.41V13.41C0.949219 14.4708 1.37064 15.4883 2.12079 16.2385C2.87093 16.9886 3.88835 17.41 4.94922 17.41H6.54926C8.65926 19.35 11.2693 20.78 12.5493 20.33C14.6493 19.55 14.9992 15.33 14.9992 12.41C14.9992 9.48996 14.6493 5.28005 12.5493 4.50005Z" :
      "M18.1292 6.28008C18.0012 5.89129 17.795 5.53273 17.5233 5.22661C17.2516 4.9205 16.9201 4.67327 16.5493 4.50005C15.3193 4.04005 12.7093 5.49996 10.5493 7.40996H8.94922C7.88835 7.40996 6.87093 7.83145 6.12079 8.58159C5.37064 9.33174 4.94922 10.3491 4.94922 11.41V13.41C4.9489 14.1811 5.17151 14.936 5.59021 15.5835C6.00892 16.2311 6.60585 16.7438 7.3092 17.06",
    d2: hasSound ? "M20.6602 6.71997C22.1593 8.22011 23.0015 10.2542 23.0015 12.375C23.0015 14.4958 22.1593 16.5299 20.6602 18.03" :
      "M10.9395 17.72C12.9395 19.5 15.3895 20.72 16.5495 20.33C18.6495 19.55 18.9995 15.3299 18.9995 12.4099C18.9995 11.5999 18.9995 10.68 18.8895 9.77002",
    d3: hasSound ? "M18.5391 15.95C19.4764 15.0123 20.003 13.7407 20.003 12.4149C20.003 11.0891 19.4764 9.81764 18.5391 8.88" :
      "M22 2.42004L2 22.42"
  });

  console.log(hasSound)

  return (
    <button
      className="btn btn-circle"
      onClick={() => setHasSound(!hasSound)}
    >
      <svg width="800px" height="800px" viewBox="-0.5 0 25 25" >
        <animated.path
          style={toggleSoundButtonProps}
          d={toggleSoundButtonProps.d1}
        />
        <animated.path
          style={toggleSoundButtonProps}
          d={toggleSoundButtonProps.d2}
        />
        <animated.path
          style={toggleSoundButtonProps}
          d={toggleSoundButtonProps.d3}
        />
      </svg>
    </button>
  );
	
}

export default ToggleSoundButton;