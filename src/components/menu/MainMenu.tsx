import { MenuItem } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { EditorState } from '../../model/EditorState';
import { convertMapStateToFile } from '../../model/map/converters';
import { useMapData } from '../../model/map/MapData';
import { loadMap } from '../../store/reducers/editor-slice';
import { HtmlUtils, TextFile } from '../../utils/HtmlUtils';
import { LayerPicker } from '../layers/LayerPicker';
import { ZoomSlider } from './ZoomSlider';

export function MainMenu() {

    const state: EditorState = useAppSelector(state => state.editor);
    const dispatch = useAppDispatch();
    const mapData = useMapData();

    const handleLoad = async () => {
        const file: TextFile = await HtmlUtils.promptToLoadTextFile(".smh");
        dispatch(loadMap(file));
    };

    const handleSave = async () => {
        if (!state.map)
            return;
        const file: File = await HtmlUtils.promptUserForFile(".smh");
        if (file) {
            const mapFile = convertMapStateToFile(state.map, mapData);
            const json = JSON.stringify(mapFile);
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