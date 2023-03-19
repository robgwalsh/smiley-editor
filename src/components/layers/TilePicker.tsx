import React, { useState } from "react";
import { useAppSelector } from "../../hooks";
import { EditorState } from "../../model/EditorState";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { setSelectedTexture } from "../../store/editor-slice";
import { MapFileTexture } from "../../model/map/MapFile";

/**
 * UI for selecting tiles from a texture for placing on the active map layer.
 */
export function TilePicker() {

    const state: EditorState = useAppSelector(state => state.editor);
    const dispatch = useDispatch();

    if (!state.map || !state.selectedTextureName)
        return (<></>)

    // const activeLayer = getActiveLayer(state);
    // if (!activeLayer)
    //     return (<></>)

    const selectedTexture = state.map.header.textures.find(t => t.name === state.selectedTextureName);

    const handleLeft = () => {
        if (state.selectedTextureIndex > 0) {
            dispatch(setSelectedTexture([state.selectedTextureName, state.selectedTextureIndex - 1]));
        } else {
            let i = state.map.header.textures.indexOf(selectedTexture);
            i = i === 0 ? state.map.header.textures.length - 1 : i - 1;
            dispatch(setSelectedTexture([state.map.header.textures[i].name, 0]));
        }
    };

    const handleRight = () => {
        if (state.selectedTextureIndex < selectedTexture.tilesetPaths.length - 1) {
            dispatch(setSelectedTexture([state.selectedTextureName, state.selectedTextureIndex + 1]));
        } else {
            let i = state.map.header.textures.indexOf(selectedTexture);
            i = i === state.map.header.textures.length - 1 ? 0 : i + 1;
            dispatch(setSelectedTexture([state.map.header.textures[i].name, 0]));
        }
    };

    // TODO: buttons to cycle through images in the texture, if there is more than 1
    return (
        <div>
            <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }} />
                <div style={{ flex: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                    <IconButton onClick={handleLeft}>
                        <ArrowLeftIcon />
                    </IconButton>
                    <Typography sx={{ width: "110px", textAlign: "center" }}>
                        {getTerrainLabel(state, selectedTexture)}
                    </Typography>
                    <IconButton onClick={handleRight}>
                        <ArrowRightIcon />
                    </IconButton>
                </div>
                <div style={{ flex: 1 }} />
            </div>
            <div style={{ border: "1px solid #232323" }}>
                <img
                    width={500}
                    style={{ objectFit: "contain" }}
                    src={selectedTexture.tilesetPaths[state.selectedTextureIndex]}
                />
            </div>
        </div>
    )
}

function getTerrainLabel(state: EditorState, selectedTexture: MapFileTexture): string {
    if (selectedTexture.tilesetPaths.length === 1)
        return state.selectedTextureName;
    return `${state.selectedTextureName} (${state.selectedTextureIndex + 1} / ${selectedTexture.tilesetPaths.length})`;
}

// function getActiveLayer(state: EditorState): LayerState {
//     switch (state.activeLayerName) {
//         case null:
//             return null;
//         case state.map.idLayer.name:
//             return state.map.idLayer;
//         case state.map.variableLayer.name:
//             return state.map.variableLayer;
//         case state.map.enemyLayer.name:
//             return state.map.enemyLayer
//         case state.map.itemLayer.name:
//             return state.map.itemLayer;
//         case state.map.walkLayer:
//             return state.map.walkLayer;
//         default:
//             return state.map.visualLayers.find(l => l.name === state.activeLayerName);
//     }
// }