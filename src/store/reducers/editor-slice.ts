import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { SmileyMap } from "../../model/SmileyMap";

export interface EditorState {
    map: SmileyMap | null;
    layers: LayerState[];
}

export interface LayerState {
    name: string;
    index: number;
    visible: boolean;
}

const initialState: EditorState = {
    map: null,
    layers: [
    ]
};

export const editorSlice = createSlice({
    name: "editor",
    initialState: initialState,
    reducers: {
        setMap: (state: Draft<EditorState>, action: PayloadAction<SmileyMap>) => {
            state.map = action.payload;
        },
    },
});

export const { setMap } = editorSlice.actions;

export default editorSlice.reducer;