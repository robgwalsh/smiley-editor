import React from "react";
import { useAppSelector } from "../../hooks";
import { EditorState } from "../../model/EditorState";

export function LayerPicker() {

    const { activeLayer, layers } = useAppSelector<EditorState>(state => state.editor);

    return (
        <div style={{ display: "flex" }}>
            {Array.from(layers.values()).map(layer => (
                <div key={layer.name}>
                    {layer.name}
                </div>
            ))}
        </div>
    );
}