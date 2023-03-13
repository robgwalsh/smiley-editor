import React from "react"
import { useAppSelector } from "../hooks";
import { EditorState } from "../model/EditorState";

export function Footer() {

    const state: EditorState = useAppSelector(state => state.editor);

    const mouseCellX = Math.floor((state.mouseX - state.viewport.x) / state.viewport.zoom / state.cellDiameter);
    const mouseCellY = Math.floor((state.mouseY - state.viewport.y) / state.viewport.zoom / state.cellDiameter);

    const labelStyle = {
        fontWeight: 600
    };

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#121212",
            padding: "10px",
            height: "30px",
            gap: "25px"
        }}>
            <label style={labelStyle}>viewport: {Math.round(state.viewport.x)}, {Math.round(state.viewport.y)}</label>
            <label style={labelStyle}>{Math.round(state.viewport.width)}x{Math.round(state.viewport.height)}</label>


            <label style={labelStyle}>mouse: {state.mouseX}, {state.mouseY}</label>
            <label style={labelStyle}>cell: {mouseCellX}, {mouseCellY}</label>
        </div>
    )
}