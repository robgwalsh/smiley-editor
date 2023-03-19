import { MenuItem } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { EditorState } from '../../model/EditorState';
import { convertMapStateToFile } from '../../model/map/converters';
import { getMapData } from '../../model/map/MapData';
import { loadMapAsync } from '../../store/actions/loadMapAsync';
import { HtmlUtils, TextFile } from '../../utils/HtmlUtils';
import { LayerPicker } from '../layers/LayerPicker';
import { ZoomSlider } from './ZoomSlider';

export function MainMenu() {

    const state: EditorState = useAppSelector(state => state.editor);
    const mapData = getMapData();
    const dispatch = useAppDispatch();

    const handleNew = () => {
        alert("TODO:");
    }

    const handleLoad = async () => {
        const file: TextFile = await HtmlUtils.promptToLoadTextFile(".smh");
        if (file) {
            dispatch(loadMapAsync(file));
        }
    };

    const handleSave = async () => {
        if (!state.map)
            return;

        if (typeof (window as any).showSaveFilePicker === "undefined") {
            alert("your browser hasn't implemented the file system API yet! Use chrome for now");
            return;
        }

        const opts = {
            types: [
                {
                    description: "Smiley's Maze Hunt map file",
                    accept: {
                        "text/plain": [".smh"],
                        "application/octet-stream": [".smh"]
                    },
                },
            ],
        };

        const file = await (window as any).showSaveFilePicker(opts);

        // if (file) {

        // }

        //const file: File = await HtmlUtils.promptUserForFile(".smh");


        // if (file) {
        //     const mapFile = convertMapStateToFile(state.map, mapData);
        //     const json = JSON.stringify(mapFile);
        //     await HtmlUtils.downloadTextAsFile(json, file.name);
        // }
    };

    const handleDownload = async () => {
        const json: string = JSON.stringify(convertMapStateToFile(state.map, mapData), null, 4);
        await HtmlUtils.downloadTextAsFile(json, "map.smh");
    }

    return (
        <div style={{ display: "flex", alignItems: "center", height: "50px" }}>

            <MenuItem onClick={handleNew}>New</MenuItem>
            <MenuItem onClick={handleLoad}>Load</MenuItem>
            <MenuItem onClick={handleSave}>Save</MenuItem>
            <MenuItem onClick={handleDownload}>Download</MenuItem>

            {state.map && <ZoomSlider />}

            <div style={{ flex: 1 }}></div>

            <div style={{ width: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LayerPicker />
            </div>
        </div>
    );
}