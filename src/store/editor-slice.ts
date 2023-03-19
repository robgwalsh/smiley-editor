import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { EditorState, initialEditorState } from "../model/EditorState";
import { Vector } from "../model/Vector";
import { loadMapAsync } from "./actions/loadMapAsync"

export const editorSlice = createSlice({
    name: "editor",
    initialState: initialEditorState(),
    reducers: {
        setViewportSize: (state: Draft<EditorState>, action: PayloadAction<Vector>) => {
            state.viewport.width = action.payload.x;
            state.viewport.height = action.payload.y;
        },
        setViewportOffset: (state: Draft<EditorState>, action: PayloadAction<Vector>) => {
            state.viewport.x = action.payload.x;
            state.viewport.y = action.payload.y;
        },
        pan: (state: Draft<EditorState>, action: PayloadAction<Vector>) => {
            state.viewport.x = state.viewport.x + action.payload.x;
            state.viewport.y = state.viewport.y + action.payload.y;
        },
        setActiveLayerName: (state: Draft<EditorState>, action: PayloadAction<string>) => {
            state.activeLayerName = action.payload;
            if (state.activeLayerName == "main") {
                // hack!
                state.selectedTextureName = state.map.header.textures[0].name;
                state.selectedTextureIndex = 0;
            } else {
                const texture = state.map.header.textures.find(t => t.name.toLocaleLowerCase() === state.activeLayerName.toLocaleLowerCase());
                if (texture) {
                    state.selectedTextureName = texture.name;
                    state.selectedTextureIndex = 0;
                }
            }
        },
        setZoom: (state: Draft<EditorState>, action: PayloadAction<number>) => {
            state.zoom = action.payload;
        },
        setMousePosition: (state: Draft<EditorState>, action: PayloadAction<Vector>) => {
            state.mouseX = action.payload.x;
            state.mouseY = action.payload.y;
        },
        setMouseOnMap: (state: Draft<EditorState>, action: PayloadAction<boolean>) => {
            state.mouseOnMap = action.payload;
        },
        setIsMapLoading: (state: Draft<EditorState>, action: PayloadAction<boolean>) => {
            state.isLoadingMap = action.payload;
        },
        zoomAtMouse: (state: Draft<EditorState>, action: PayloadAction<boolean>) => {
            const scaleFactor = action.payload ? 1.15 : 0.87;
            const newZoom = Math.min(1, Math.max(.05, state.zoom * scaleFactor));
            if (newZoom !== state.zoom) {
                // Center the viewport around the mouse position.
                const mouseP = new Vector(state.mouseX + state.viewport.x, state.mouseY + state.viewport.y);
                const delta = mouseP.subVector(mouseP.multScalar(newZoom / state.zoom));
                state.viewport.x = state.viewport.x - delta.x;
                state.viewport.y = state.viewport.y - delta.y;
                state.zoom = newZoom;
            }
        },
        setSelectedTexture: (state: Draft<EditorState>, action: PayloadAction<[string, number]>) => {
            state.selectedTextureName = action.payload[0];
            state.selectedTextureIndex = action.payload[1];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadMapAsync.pending, (state, action) => {
                state.isLoadingMap = true;
            })
            .addCase(loadMapAsync.fulfilled, (state, action) => {
                state.isLoadingMap = false;
                state.map = action.payload;
                state.activeLayerName = state.map.visualLayers[0].name;
                state.selectedTextureName = state.map.header.textures[0].name;
                state.selectedTextureIndex = 0;
            })
            .addCase(loadMapAsync.rejected, (state, action) => {
                state.isLoadingMap = false;
                alert(`ERROR IN PROGRAM ${action.error.message}`);
            });
    },
});

export const { setViewportSize, setActiveLayerName, setZoom, setMousePosition, setMouseOnMap, zoomAtMouse, setIsMapLoading, setViewportOffset, pan, setSelectedTexture } = editorSlice.actions;

export default editorSlice.reducer;