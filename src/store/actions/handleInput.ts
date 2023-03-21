import { Draft, PayloadAction } from "@reduxjs/toolkit";
import { EditorState } from "../../model/EditorState";
import { StateUtils } from "../../utils/StateUtils";

export function handleInputImpl(state: Draft<EditorState>, action: PayloadAction<string>) {
    const selection = state.tileSelections[action.payload];
    if (!selection) {
        const cell = StateUtils.getMousedOverCell(state);
        StateUtils.setLayerValue(
            state,
            selection.layerName ?? state.selectedLayerName,
            cell.x, cell.y,
            selection.textureId,
            selection.tile)
    }
}