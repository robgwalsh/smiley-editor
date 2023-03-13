import React from "react"
import { useAppSelector } from "../hooks";
import { EditorState } from "../model/EditorState";

export function Footer() {

    const state: EditorState = useAppSelector(state => state.editor);

    const mouseCellX = Math.floor((state.mouseX - state.viewport.x) / state.viewport.zoom / state.cellDiameter);
    const mouseCellY = Math.floor((state.mouseY - state.viewport.y) / state.viewport.zoom / state.cellDiameter);

    const labelStyle = {
        fontWeight: 400,
        color: "#dfdfdf"
    };

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#121212",
            padding: "15px 15px 15px 0",
            height: "35px",
            gap: "25px"
        }}>
            <label style={{...labelStyle, width: "140px" }}>viewport: {Math.round(state.viewport.x)}, {Math.round(state.viewport.y)}</label>
            <label style={labelStyle}>{Math.round(state.viewport.width)}x{Math.round(state.viewport.height)}</label>


            <label style={{...labelStyle, width: "140px" }}>mouse: {Math.round(state.mouseX)}, {Math.round(state.mouseY)}</label>
            <label style={{...labelStyle, width: "140px" }}>cell: {mouseCellX}, {mouseCellY}</label>
        </div>
    )
}