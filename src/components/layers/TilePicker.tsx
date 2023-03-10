import React from "react";
import { useAppSelector } from "../../hooks";
import { EditorState, Layer } from "../../model/EditorState";

export function TilePicker() {

    const { activeLayer, layers } = useAppSelector<EditorState>(state => state.editor);

    const textureUrl = `https://smiley-editor.s3.amazonaws.com/${activeLayer.textureName}`;

    return (
        <div>
            <img
                width={500}
                style={{ objectFit: "contain" }}
                src={textureUrl}
            />
        </div>
    )
}