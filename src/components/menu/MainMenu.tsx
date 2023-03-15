import { AppBar, MenuItem, Toolbar } from '@mui/material';
import React from 'react';
import { useAppDispatch } from '../../hooks';
import { LegacyMapLoader } from '../../model/map/LegacyMapLoader';
import { useMap } from '../../model/map/SmileyMap';
import { loadMap } from '../../store/reducers/editor-slice';
import { HtmlUtils, TextFile } from '../../utils/HtmlUtils';
import { LayerPicker } from '../layers/LayerPicker';
import { ZoomSlider } from './ZoomSlider';

export function MainMenu() {

    const dispatch = useAppDispatch();
    const map = useMap();

    const handleLoad = async () => {

        await (window as any).showOpenFilePicker();

        // const file: TextFile = await HtmlUtils.promptToLoadTextFile(".smh");
        // dispatch(loadMap(file));
    };

    const handleSave = async () => {
        if (!map)
            return;
        const file: File = await HtmlUtils.promptUserForFile(".smh");
        if (file) {
            const json = JSON.stringify(map.toMapFile());
            await HtmlUtils.downloadTextAsFile(json, file.name);
        }
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