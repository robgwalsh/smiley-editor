import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks";
import { EditorState } from "../../model/EditorState";
import { LayerState } from "../../model/map/MapState";
import { setActiveLayerName } from "../../store/editor-slice";
import { StateUtils } from "../../utils/StateUtils";

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

    const layers: LayerState[] = StateUtils.getLayers(state);

    return (
        <ToggleButtonGroup
            color="primary"
            value={state.activeLayerName}
            style={{ height: "30px" }}
            exclusive
            onChange={handleSelection}
            aria-label="Platform"
        >
            {layers.map(layer => (
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