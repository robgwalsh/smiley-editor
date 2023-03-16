import { ToggleButton } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { LayerState } from "../../model/map/MapState";

interface Props {
    layer: LayerState
}

export function LayerPickerButton(props: Props) {
    return (
        <ToggleButton
            key={props.layer.name}
            value={props.layer.name}
        >
            {props.layer.name}
        </ToggleButton>
    )
}