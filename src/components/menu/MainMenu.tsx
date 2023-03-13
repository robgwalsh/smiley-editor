import { AppBar, MenuItem, Toolbar } from '@mui/material';
import React from 'react';
import { useAppDispatch } from '../../hooks';
import { SmileyMapLoader } from '../../model/SmileyMapLoader';
import { loadMap } from '../../store/reducers/editor-slice';
import { HtmlUtils, TextFile } from '../../utils/HtmlUtils';
import { LayerPicker } from '../layers/LayerPicker';
import { ZoomSlider } from './ZoomSlider';

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
        <div style={{ display: "flex", alignItems: "center", height: "50px" }}>

            <MenuItem onClick={handleLoad}>Load</MenuItem>
            <MenuItem onClick={handleSave}>Save</MenuItem>

            <ZoomSlider></ZoomSlider>

            <div style={{ flex: 1 }}></div>

            <div style={{ width: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LayerPicker />
            </div>
        </div>
    );
}