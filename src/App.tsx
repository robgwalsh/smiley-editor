import React from 'react';
import './App.css';
import { Menu } from './components/menu/Menu';

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection:"column" }}>
        <div style={{ flex: 0 }}>
            <Menu />
        </div>

        <div style={{ flex: 1 }}>
            main area
        </div>

        <div style={{ flex: 0 }}>
            footer
        </div>
    </div>
  );
}

export default App;
