import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks";
import { EditorState } from "../../model/EditorState";
import { setActiveLayerName } from "../../store/reducers/editor-slice";
import { LayerPickerButton } from "./LayerPickerButton";

export function LayerPicker() {

    const state = useAppSelector<EditorState>(state => state.editor);
    const dispatch = useDispatch();

    const handleSelection = (event: React.MouseEvent<HTMLElement>, newLayerName: string) => {
        if (newLayerName !== null) {
            dispatch(setActiveLayerName(newLayerName));
        }
    }

    return (
        <ToggleButtonGroup
            color="primary"
            value={state.activeLayerName}
            style={{ height: "30px" }}
            exclusive
            onChange={handleSelection}
            aria-label="Platform"
        >
            {state.map.visualLayers.map(layer => <LayerPickerButton layer={layer} />)}
            <LayerPickerButton layer={state.map.walkLayer} />
            <LayerPickerButton layer={state.map.itemLayer} />
            <LayerPickerButton layer={state.map.enemyLayer} />

            {/* TODO: "event" picker that represents both id and variable */}
            <LayerPickerButton layer={state.map.variableLayer} />
        </ToggleButtonGroup>
    );
}