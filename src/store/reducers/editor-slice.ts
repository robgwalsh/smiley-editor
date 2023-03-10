import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { EditorState, EditorStateFactory } from "../../model/EditorState";
import { SmileyMap } from "../../model/SmileyMap";
import { Vector } from "../../model/Vector";

export const editorSlice = createSlice({
    name: "editor",
    initialState: EditorStateFactory.initialState(),
    reducers: {
        setMap: (state: Draft<EditorState>, action: PayloadAction<SmileyMap>) => {
            state.map = action.payload;
        },
        setViewportSize: (state: Draft<EditorState>, action: PayloadAction<Vector>) => {
            state.viewport.size = action.payload;
        },
    },
});

export const { setMap, setViewportSize } = editorSlice.actions;

export default editorSlice.reducer;