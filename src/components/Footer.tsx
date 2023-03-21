import React from "react"
import { useAppSelector } from "../hooks";
import { EditorState } from "../model/EditorState";
import { StateUtils } from "../utils/StateUtils";

export function Footer() {

    const state: EditorState = useAppSelector(state => state.editor);

    if (!state.map)
        return <div style={{ height: "35px" }}></div>

    const cell = StateUtils.getMousedOverCell(state);

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
            gap: "15px"
        }}>
            <label style={{ ...labelStyle, width: "110px" }}>cell: {cell.x}, {cell.y}</label>
            {/* <label style={{ ...labelStyle, width: "140px" }}>mouse: {Math.round(state.mouseX)}, {Math.round(state.mouseY)}</label> */}

            {StateUtils.getLayers(state).map(
                layer => {
                    const v = StateUtils.getLayerValue(state, layer.name, cell.x, cell.y);
                    return (
                        <label key={layer.name} style={{ ...labelStyle, width: "90px" }}>
                            {layer.name} {v[0]}, {v[1]}
                        </label>
                    );
                }
            )}
        </div>
    )
}