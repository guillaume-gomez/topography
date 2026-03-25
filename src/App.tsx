import { useContext } from 'react';
import { SettingsContext } from "./components/SettingsContextWrapper";

import ThreejsRenderer from './components/threeJs/ThreeJsRenderer';
//import TiltCard from "./components/TiltCard";
import useTopography from "./components/hooks/useTopography";

function App() {
  const {
    isLight,
    setLight,
    width,
    height, 
    numberOfLayers,
    setAnimationState
  } = useContext(SettingsContext);
  const { generate, shapes } = useTopography({width, height, numberOfLayers});
  
  return (
    <>
          <div class="
          absolute -z-10 inset-0 h-full w-full 
          bg-[linear-gradient(to_right,#73737320_1px,transparent_1px),linear-gradient(to_bottom,#73737320_1px,transparent_1px)] 
          bg-[size:20px_20px]"
      />
      <h1>Vite + React</h1>
      {/*<TiltCard />*/}
      <button className="btn btn-primary" onClick={() => {generate(); setAnimationState("started")}}>
        Generate
      </button>
      <button className="btn btn-xs btn-secondary" onClick={() => setLight(!isLight)}>
        {isLight ? "Light" : "Dark"}
      </button>
      <div className="w-full h-screen">
        <ThreejsRenderer shapes={shapes} />
      </div>
    </>
  )
}

export default App
