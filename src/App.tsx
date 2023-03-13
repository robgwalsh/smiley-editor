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

const padding = "20px";

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
                backgroundColor: "#121212",
                display: "flex",
                flexDirection: "column",
                overflowX: "hidden",
                overflowY: "hidden"
            }}>
                <div style={{ flex: 0, marginLeft: padding, marginRight: padding }}>
                    <MainMenu />
                </div>

                <div style={{ display: "flex", flexDirection: "row", alignItems: "stretch", flex: 1, margin: `0 ${padding} 0 ${padding}` }}>
                    <div style={{ flex: 1, height: "100%" }}>
                        {map ? <MapViewer /> : <Welcome />}
                    </div>

                    <div style={{ flex: 0, display: "flex", flexDirection: "column", marginLeft: padding }}>
                        <div style={{ flex: 1 }}>
                            <TilePicker />
                        </div>
                    </div>
                </div>

                <div style={{ flex: 0, marginLeft: padding }}>
                    <Footer />
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
