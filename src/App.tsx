import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { Footer } from './components/Footer';
import { TilePicker } from './components/layers/TilePicker';
import { MapViewer } from './components/map-viewer/MapViewer';
import { MainMenu } from './components/menu/MainMenu';
import { Welcome } from './components/Welcome';
import { useAppSelector } from './hooks';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const padding = "20px";

function App() {
    const state = useAppSelector(state => state.editor);

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
                    <div style={{ flex: 1, height: "100%", backgroundColor: "#191919", borderRadius: "6px" }}>
                        {state.map ? <MapViewer /> : <Welcome />}
                    </div>

                    <div style={{ flex: 0, display: "flex", flexDirection: "column", marginLeft: padding, width: "500px" }}>
                        <div style={{ flex: 1 }}>
                            {/* TODO: show special picker for id/variable ("event") layer */}
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
