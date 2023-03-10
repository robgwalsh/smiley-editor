import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks";
import { EditorState, Layer } from "../../model/EditorState";
import { setActiveLayer } from "../../store/reducers/editor-slice";

export function LayerPicker() {

    const { activeLayer, layers } = useAppSelector<EditorState>(state => state.editor);
    const dispatch = useDispatch();

    const handleSelection = (event: React.MouseEvent<HTMLElement>, newLayerName: string) => {
        if (newLayerName !== null) {
            dispatch(setActiveLayer(layers.find(l => l.name == newLayerName)));
        }
    }

    const sortedLayers = [...layers];
    sortedLayers.sort((a, b) => a.displayIndex - b.displayIndex);

    return (
        <ToggleButtonGroup
            color="primary"
            value={activeLayer.name}
            exclusive
            onChange={handleSelection}
            aria-label="Platform"
        >
            {sortedLayers.map(layer => (
                <ToggleButton
                    key={layer.name}
                    value={layer.name}
                >
                    {layer.name}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}