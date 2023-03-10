import { AppBar, MenuItem, Toolbar } from '@mui/material';
import React from 'react';
import { useAppDispatch } from '../../hooks';
import { SmileyMapLoader } from '../../model/SmileyMapLoader';
import { loadMap } from '../../store/reducers/editor-slice';
import { HtmlUtils, TextFile } from '../../utils/HtmlUtils';

export function MainMenu() {

    const dispatch = useAppDispatch();

    const handleLoad = async () => {
        const file: TextFile = await HtmlUtils.promptToLoadTextFile(".smh");
        dispatch(loadMap(file));
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