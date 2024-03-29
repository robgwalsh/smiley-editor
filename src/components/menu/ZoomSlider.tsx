import { Button, Input, MenuItem, Slider } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { EditorState } from "../../model/EditorState";
import { setZoom } from "../../store/editor-slice";
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

export function ZoomSlider() {

    const dispatch = useAppDispatch();

    const min = 0.05;
    const max = 1;
    const step = .05;

    const state = useAppSelector<EditorState>(state => state.editor);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setZoom(Number(event.target.value)));
    };

    const handleBlur = () => {
        if (state.zoom < min) {
            dispatch(setZoom(min));
        } else if (state.zoom > max) {
            dispatch(setZoom(max));
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <MenuItem
                style={{ padding: "5px", borderRadius: "5px", marginRight: "5px" }}
                onClick={e => dispatch(setZoom(Math.max(min, state.zoom - step)))}
            >
                <ZoomOutIcon />
            </MenuItem>
            <div style={{ width: "250px" }}>
                <Slider
                    style={{ marginTop: "5px" }}
                    value={state.zoom}
                    onChange={(e, newValue: number) => dispatch(setZoom(newValue))}
                    min={min}
                    max={max}
                    step={step}
                />
            </div>
            <MenuItem
                style={{ padding: "5px", marginLeft: "15px", borderRadius: "5px" }}
                onClick={e => dispatch(setZoom(Math.min(max, state.zoom + step)))}
            >
                <ZoomInIcon />
            </MenuItem>
            <div style={{ width: "50px" }}>
                <Input
                    value={state.zoom}
                    size="small"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    inputProps={{
                        step: { step },
                        min: { min },
                        max: { max },
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                    }}
                />
            </div>
        </div>
    )
}