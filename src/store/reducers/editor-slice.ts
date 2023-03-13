import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { EditorState, initialEditorState, LayerState } from "../../model/EditorState";
import { setMap } from "../../model/SmileyMap";
import { SmileyMapLoader } from "../../model/SmileyMapLoader";
import { Vector } from "../../model/Vector";
import { TextFile } from "../../utils/HtmlUtils";

export const editorSlice = createSlice({
    name: "editor",
    initialState: initialEditorState(),
    reducers: {
        loadMap: (state: Draft<EditorState>, action: PayloadAction<TextFile>) => {
            // The map is accessed via a singleton because it is too large to store in redux!!
            setMap(SmileyMapLoader.load(action.payload.contents));
            state.mapFileName = action.payload.name; // this is mainly just to trigger a state update
        },
        setViewportSize: (state: Draft<EditorState>, action: PayloadAction<Vector>) => {
            state.viewport.width = action.payload.x;
            state.viewport.height = action.payload.y;
        },
        setActiveLayer: (state: Draft<EditorState>, action: PayloadAction<LayerState>) => {
            state.activeLayer = action.payload;
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
        zoomAtMouse: (state: Draft<EditorState>, action: PayloadAction<boolean>) => {
            const scaleFactor = action.payload ? 1.15 : 0.87;
            const newZoom = Math.min(1, Math.max(.15, state.viewport.zoom * scaleFactor));
            if (newZoom !== state.viewport.zoom) {
                // Center the viewport around the mouse position.
                // TODO:
                // const mouseP = new Vector(state.mouseX, state.mouseY);
                // const delta = mouseP.subVector(mouseP.multScalar(newZoom / state.viewport.zoom));
                state.viewport.zoom = newZoom;
                // state.viewport.x = state.viewport.x + delta.x;
                // state.viewport.y = state.viewport.y + delta.y;
            }
        },
    },
});

export const { loadMap, setViewportSize, setActiveLayer, setZoom, setMousePosition, setMouseOnMap, zoomAtMouse } = editorSlice.actions;

export default editorSlice.reducer;