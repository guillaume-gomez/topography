import { useContext } from 'react';
import { SettingsContext } from "./components/SettingsContextWrapper";

import ChooseColor from "./ChooseColor";
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
    setNumberOfLayers,
    setAnimationState,
  } = useContext(SettingsContext);
  const { generate, shapes } = useTopography({width, height, numberOfLayers});
  
  return (
    <>
      <h1>Vite + React</h1>
      {/*<TiltCard />*/}
      <button className="btn btn-primary" onClick={() => {generate(); setAnimationState("started")}}>
        Generate
      </button>
      <button className="btn btn-xs btn-secondary" onClick={() => setLight(!isLight)}>
        {isLight ? "Light" : "Dark"}
      </button>
      {/*<div className="w-full h-screen">
        <ThreejsRenderer shapes={shapes} />
      </div>*/}
      <ChooseColor onSubmit={() => console.log("fdkjd")} />
    </>
  )
}

export default App
