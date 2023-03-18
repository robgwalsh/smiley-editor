import { MenuItem } from '@mui/material';
import React from 'react';
import { batch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { EditorState } from '../../model/EditorState';
import { Vector } from '../../model/Vector';
import { loadMapAsync } from '../../store/actions/loadMapAsync';
import { setViewportOffset, setZoom } from '../../store/editor-slice';
import { HtmlUtils, TextFile } from '../../utils/HtmlUtils';
import { LayerPicker } from '../layers/LayerPicker';
import { ZoomSlider } from './ZoomSlider';

export function MainMenu() {

    const state: EditorState = useAppSelector(state => state.editor);
    const dispatch = useAppDispatch();

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

        if (file) {

        }

        //const file: File = await HtmlUtils.promptUserForFile(".smh");


        // if (file) {
        //     const mapFile = convertMapStateToFile(state.map, mapData);
        //     const json = JSON.stringify(mapFile);
        //     await HtmlUtils.downloadTextAsFile(json, file.name);
        // }
    };

    const handleResetViewport = () => {
        dispatch(setViewportOffset(new Vector(0, 0)));
        dispatch(setZoom(1));
    };

    return (
        <div style={{ display: "flex", alignItems: "center", height: "50px" }}>

            <MenuItem onClick={handleLoad}>Load</MenuItem>
            <MenuItem onClick={handleSave}>Save</MenuItem>
            <MenuItem onClick={handleResetViewport}>Reset Viewport</MenuItem>

            {state.map && <ZoomSlider />}

            <div style={{ flex: 1 }}></div>

            <div style={{ width: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LayerPicker />
            </div>
        </div>
    );
}