import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { EditorState, Layer, LayerState } from "../../model/EditorState";
import { EditorStateFactory } from "../../model/EditorStateFactory";
import { setMap } from "../../model/SmileyMap";
import { SmileyMapLoader } from "../../model/SmileyMapLoader";
import { Vector } from "../../model/Vector";
import { TextFile } from "../../utils/HtmlUtils";

export const editorSlice = createSlice({
    name: "editor",
    initialState: EditorStateFactory.initialState(),
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
    },
});

export const { loadMap, setViewportSize, setActiveLayer } = editorSlice.actions;

export default editorSlice.reducer;