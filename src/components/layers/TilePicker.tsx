import React, { useState } from "react";
import { useAppSelector } from "../../hooks";
import { EditorState } from "../../model/EditorState";
import { LayerState, LayerType } from "../../model/map/MapState";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { IconButton } from "@mui/material";
import { MapFileTexture } from "../../model/map/MapFile";
import Typography from "@mui/material/Typography";

interface TextureSelection {
    texture: MapFileTexture;
    index: number;
}

/**
 * UI for selecting tiles from a texture for placing on the active map layer.
 */
export function TilePicker() {

    const state: EditorState = useAppSelector(state => state.editor);
    // const [textureSelection, setTextureSelection] = useState<TextureSelection>({
    //     texture: state.map.header.textures[0],
    //     index: 0
    // });

    if (!state.map)
        return (<></>)

    // const activeLayer = getActiveLayer(state);
    // if (!activeLayer)
    //     return (<></>)

    const selectedTexture = state.map.header.textures.find(t=>t.name === state.selectedTextureName);

    const handleLeft = () => {

    };

    const handleRight = () => {

    };

    // if (activeLayer.layer === LayerType.Visual) {
    //     // TODO: special cases for walk/item/enemy vs visual ?
    // }



    // TODO: buttons to cycle through images in the texture, if there is more than 1
    return (
        <div>
            <div style={{ display: "flex" }}>
                <IconButton onClick={handleLeft}>
                    <ArrowLeftIcon />
                </IconButton>

                <Typography>{state.selectedTextureName} (${state.selectedTextureIndex + 1} / {selectedTexture.tilesetPaths.length})</Typography>

                <IconButton onClick={handleRight}>
                    <ArrowRightIcon />
                </IconButton>
            </div>
            <div>
                <img
                    width={500}
                    style={{ objectFit: "contain" }}
                    src={selectedTexture.tilesetPaths[state.selectedTextureIndex]}
                />
            </div>
        </div>
    )
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