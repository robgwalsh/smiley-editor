import { ToggleButtonGroup } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks";
import { EditorState } from "../../model/EditorState";
import { setActiveLayerName } from "../../store/editor-slice";
import { LayerPickerButton } from "./LayerPickerButton";

export function LayerPicker() {

    const state = useAppSelector<EditorState>(state => state.editor);
    const dispatch = useDispatch();

    if (!state.map)
        return (<></>)

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
            {state.map.visualLayers.map(layer => <LayerPickerButton layer={layer} key={layer.name} />)}
            <LayerPickerButton layer={state.map.walkLayer} key={state.map.walkLayer.name} />
            <LayerPickerButton layer={state.map.itemLayer} key={state.map.itemLayer.name} />
            <LayerPickerButton layer={state.map.enemyLayer} key={state.map.enemyLayer.name} />

            {/* TODO: "event" picker that represents both id and variable */}
            <LayerPickerButton layer={state.map.variableLayer} key={state.map.variableLayer.name} />
        </ToggleButtonGroup>
    );
}