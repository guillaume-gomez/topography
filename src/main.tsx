import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.tsx';
import ChooseColor from "./ChooseColor";

import SettingsContextWrapper from "./components/SettingsContextWrapper";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsContextWrapper>
      <App />
      <ChooseColor onSubmit={() => console.log("fdkjd")} />
    </SettingsContextWrapper>
  </StrictMode>,
)
