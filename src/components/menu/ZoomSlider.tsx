import { Button, Input, Slider } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { EditorState } from "../../model/EditorState";
import { setZoom } from "../../store/reducers/editor-slice";
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

export function ZoomSlider() {

    const dispatch = useAppDispatch();

    const min = 0.15;
    const max = 1;
    const step = .05;

    const state = useAppSelector<EditorState>(state => state.editor);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setZoom(Number(event.target.value)));
    };

    const handleBlur = () => {
        if (state.viewport.zoom < min) {
            dispatch(setZoom(min));
        } else if (state.viewport.zoom > max) {
            dispatch(setZoom(max));
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button
                variant="text"
                onClick={e => dispatch(setZoom(Math.max(min, state.viewport.zoom - step)))}
            >
                <ZoomOutIcon />
            </Button>
            <div style={{ width: "250px" }}>
                <Slider
                    value={state.viewport.zoom}
                    onChange={(e, newValue: number) => dispatch(setZoom(newValue))}
                    min={min}
                    max={max}
                    step={step}
                />
            </div>
            <Button
                variant="text"
                onClick={e => dispatch(setZoom(Math.min(max, state.viewport.zoom + step)))}
            >
                <ZoomInIcon />
            </Button>
            <div style={{ width: "50px" }}>
                <Input
                    value={state.viewport.zoom}
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