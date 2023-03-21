import { useAppSelector } from "../../hooks";
import { EditorState } from "../../model/EditorState";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { assignTilePickerTarget, setSelectedTexture, setTilePickerTarget } from "../../store/editor-slice";
import { MapFileTexture } from "../../model/map/MapFile";
import { HtmlUtils, MouseButton } from "../../utils/HtmlUtils";
import { IVector } from "../../model/Vector";
import { useState } from "react";

/**
 * UI for selecting tiles from a texture for placing on the active map layer.
 */
export function TilePicker() {

    const width = 500;

    const state: EditorState = useAppSelector(state => state.editor);
    const dispatch = useDispatch();

    if (!state.map || !state.selectedTextureName)
        return <></>;

    const selectedTexture = state.map.header.textures.find(t => t.name === state.selectedTextureName);
    if (!selectedTexture)
        return <></>;

    const scale = width / selectedTexture.width;
    const tileWidth = selectedTexture.tileWidth * scale;
    const tileHeight = selectedTexture.tileHeight * scale;

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

    const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
        dispatch(setTilePickerTarget(null));
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const box: DOMRect = (e.currentTarget as any).getBoundingClientRect();
        dispatch(setTilePickerTarget({
            x: Math.floor((e.clientX - box.left) / tileWidth),
            y: Math.floor((e.clientY - box.top) / tileHeight)
        }));
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        switch (HtmlUtils.getMouseButton(e.nativeEvent)) {
            case MouseButton.Left:
                dispatch(assignTilePickerTarget("lmb"));
                return;
            case MouseButton.Middle:
                dispatch(assignTilePickerTarget("mmb"));
                return;
            case MouseButton.Right:
                dispatch(assignTilePickerTarget("rmb"));
                return;
        }

    };

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
            <div
                style={{ border: "1px solid #232323", position: "relative", width: `${width}px` }}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerDown={handlePointerDown}
            >
                <img
                    width={500}
                    style={{ objectFit: "contain", position: "absolute", left: 0, top: 0 }}
                    src={selectedTexture.tilesetPaths[state.selectedTextureIndex]}
                />
                {state.tilePickerGridPosition &&
                    <svg viewBox={`0 0 ${width} ${width}`} xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", left: 0, top: 0 }}>
                        <rect
                            x={Math.round(state.tilePickerGridPosition.x * tileWidth)}
                            y={Math.round(state.tilePickerGridPosition.y * tileHeight)}
                            width={tileWidth}
                            height={tileHeight}
                            fill="transparent"
                            stroke="red"
                            strokeWidth={1}
                        />
                    </svg>
                }
            </div>
        </div>
    )
}

function getTerrainLabel(state: EditorState, selectedTexture: MapFileTexture): string {
    if (selectedTexture.tilesetPaths.length === 1)
        return state.selectedTextureName;
    return `${state.selectedTextureName} (${state.selectedTextureIndex + 1} / ${selectedTexture.tilesetPaths.length})`;
}