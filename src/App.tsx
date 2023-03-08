import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import './App.css';
import { MainMenu } from './components/menu/MainMenu';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 0 }}>
                    <MainMenu />
                </div>

                <div style={{ flex: 1 }}>
                    main area
                </div>

                <div style={{ flex: 0 }}>
                    footer
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
