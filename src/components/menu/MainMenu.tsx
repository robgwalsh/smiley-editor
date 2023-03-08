import { AppBar, MenuItem, Toolbar } from '@mui/material';
import React from 'react';
import { SmileyMapLoader } from '../../model/SmileyMapLoader';
import { HtmlUtils } from '../../utils/HtmlUtils';

export function MainMenu() {

    const handleLoad = async () => {

        const fileText: string = await HtmlUtils.promptToLoadTextFile(".smh");
        const map = SmileyMapLoader.load(fileText);


    };

    const handleSave = () => {
        alert("todo");
    };

    return (
        <div style={{ display: "flex" }}>

            <AppBar position="static">
                <Toolbar>
                    <div style={{ display: "flex" }}>
                        <MenuItem onClick={handleLoad}>Load</MenuItem>
                        <MenuItem onClick={handleSave}>Save</MenuItem>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}