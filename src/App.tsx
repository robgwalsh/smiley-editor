import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Footer } from './components/Footer';
import { EventLayerPicker } from './components/layers/EventLayerPicker';
import { SpritePicker } from './components/layers/SpritePicker';
import { SpritePickerPreview } from './components/layers/SpritePickerPreview';
import { MapViewer } from './components/map-viewer/MapViewer';
import { MainMenu } from './components/menu/MainMenu';
import { Welcome } from './components/Welcome';
import { useAppSelector } from './hooks';
import { KeyboardShortcuts } from './KeyboardShortcuts';

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
            <KeyboardShortcuts />
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

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "stretch",
                    flex: 1,
                    margin: `0 ${padding} 0 ${padding}`
                }}>
                    <div style={{
                            flex: 1,
                            height: "100%",
                            backgroundColor: "#191919",
                            overflow: "hidden",
                            borderRadius: "6px",
                            border: "1px solid #232323"
                        }}
                    >
                        {state.map ? <MapViewer /> : <Welcome />}
                    </div>

                    <div style={{ flex: 0, marginLeft: padding, width: "500px" }}>
                        {
                            state.selectedLayerName === "Event"
                                ? <EventLayerPicker />
                                : <SpritePicker />
                        }
                        {/* <SpritePickerPreview /> */}
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
