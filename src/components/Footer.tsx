import React from "react"
import { useAppSelector } from "../hooks";
import { EditorState } from "../model/EditorState";

export function Footer() {

    const state: EditorState = useAppSelector(state => state.editor);

    if (!state.map)
        return <div style={{ height: "35px" }}></div>

    const mouseCellX = Math.floor((state.mouseX + state.viewport.x) / state.zoom / state.map.header.tileWidth);
    const mouseCellY = Math.floor((state.mouseY + state.viewport.y) / state.zoom / state.map.header.tileHeight);

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
            <label style={{...labelStyle, width: "110px" }}>cell: {mouseCellX}, {mouseCellY}</label>
            <label style={{...labelStyle, width: "140px" }}>mouse: {Math.round(state.mouseX)}, {Math.round(state.mouseY)}</label>
            {/* <label style={{...labelStyle, width: "160px" }}>viewport: {Math.round(state.viewport.x)}, {Math.round(state.viewport.y)}</label>
            <label style={{...labelStyle, width: "70px" }}>{Math.round(state.viewport.width)}x{Math.round(state.viewport.height)}</label> */}
        </div>
    )
}