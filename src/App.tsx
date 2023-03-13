import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import './App.css';
import { Footer } from './components/Footer';
import { LayerPicker } from './components/layers/LayerPicker';
import { TilePicker } from './components/layers/TilePicker';
import { MapViewer } from './components/map-viewer/MapViewer';
import { MainMenu } from './components/menu/MainMenu';
import { Welcome } from './components/Welcome';
import { useAppSelector } from './hooks';
import { useMap } from './model/SmileyMap';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    const state = useAppSelector(state => state.editor);
    const map = useMap();

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div style={{
                width: "100vw",
                height: "100vh",
                maxWidth: "100vw",
                maxHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                overflowX: "hidden",
                overflowY: "hidden"
            }}>
                <div style={{ flex: 0 }}>
                    <MainMenu />
                </div>

                <div style={{ display: "flex", flexDirection: "row", alignItems: "stretch", flex: 1 }}>
                    <div style={{ flex: 1, height: "100%" }}>
                        {map ? <MapViewer /> : <Welcome />}
                    </div>

                    <div style={{ flex: 0, display: "flex", flexDirection: "column" }}>
                        <div style={{ flex: 1 }}>
                            <TilePicker />
                        </div>
                    </div>
                </div>

                <div style={{ flex: 0 }}>
                    <Footer />
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
