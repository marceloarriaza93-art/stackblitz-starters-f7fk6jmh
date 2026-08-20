import React from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import HomeGrid from './components/HomeGrid.jsx';
import RefugioView from './components/RefugioView.jsx';
import ColorPsychology from './components/ColorPsychology.jsx';
import SoundsView from './components/SoundsView.jsx';
import SaberView from './components/SaberView.jsx';
import PolivagalRegulator from './components/PolivagalRegulator.jsx';

function Shell() {
  const { tab, openRefugioId, polivagal } = useApp();

  // Polivagal visual mode (background tint shift via CSS variables)
  React.useEffect(() => {
    const root = document.documentElement.style;
    if (polivagal === 'sympathetic') {
      root.setProperty('--ref-state-color', '#c9968f');
      root.setProperty('--ref-state-glow', 'rgba(201,150,143,0.35)');
    } else if (polivagal === 'dorsal') {
      root.setProperty('--ref-state-color', '#c79f6c');
      root.setProperty('--ref-state-glow', 'rgba(199,159,108,0.35)');
    } else {
      root.setProperty('--ref-state-color', '#a9c9a4');
      root.setProperty('--ref-state-glow', 'rgba(169,201,164,0.45)');
    }
  }, [polivagal]);

  return (
    <div className="app-filter" style={{
      display: 'flex', minHeight: '100vh',
    }}>
      <Sidebar/>
      <main style={{
        flex: 1,
        minWidth: 0,
        position: 'relative',
      }}>
        {openRefugioId ? (
          <RefugioView/>
        ) : tab === 'explorar' ? (
          <HomeGrid/>
        ) : tab === 'colores' ? (
          <ColorPsychology/>
        ) : tab === 'sonidos' ? (
          <SoundsView/>
        ) : (
          <SaberView/>
        )}
      </main>
      {!openRefugioId && <PolivagalRegulator/>}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell/>
    </AppProvider>
  );
}
