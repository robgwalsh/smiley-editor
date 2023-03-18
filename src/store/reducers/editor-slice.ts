import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { EditorState, initialEditorState } from "../../model/EditorState";
import { Vector } from "../../model/Vector";
import { loadMapAsync } from "../actrions/loadMapAsync"

export const editorSlice = createSlice({
    name: "editor",
    initialState: initialEditorState(),
    reducers: {
        setViewportSize: (state: Draft<EditorState>, action: PayloadAction<Vector>) => {
            state.viewport.width = action.payload.x;
            state.viewport.height = action.payload.y;
        },
        setActiveLayerName: (state: Draft<EditorState>, action: PayloadAction<string>) => {
            state.activeLayerName = action.payload;
        },
        setZoom: (state: Draft<EditorState>, action: PayloadAction<number>) => {
            state.viewport.zoom = action.payload;
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
            const newZoom = Math.min(1, Math.max(.15, state.viewport.zoom * scaleFactor));
            if (newZoom !== state.viewport.zoom) {
                // Center the viewport around the mouse position.
                // TODO: doesnt work yet :(
                // const mouseP = new Vector(state.mouseX, state.mouseY);
                // const delta = mouseP.subVector(mouseP.multScalar(newZoom / state.viewport.zoom));
                state.viewport.zoom = newZoom;
                // state.viewport.x = state.viewport.x + delta.x;
                // state.viewport.y = state.viewport.y + delta.y;
            }
        },
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

export const { setViewportSize, setActiveLayerName, setZoom, setMousePosition, setMouseOnMap, zoomAtMouse, setIsMapLoading } = editorSlice.actions;

export default editorSlice.reducer;