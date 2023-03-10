import React from "react";
import { useAppSelector } from "../../hooks";
import { EditorState } from "../../model/EditorState";
import { Layer, LayerState } from "../../model/Layers";

const textureNames = {
    [Layer.Main]: "mainlayer.png",
    [Layer.Walk]: "walklayer.png",
    [Layer.Item]: "itemLayer1.png",
    [Layer.Enemy]: "enemyLayer.png",
    //[Layer.Event]: "event.png",
};

export function TilePicker() {

    const { activeLayer, layers } = useAppSelector<EditorState>(state => state.editor);

    const textureUrl = `https://smiley-editor.s3.amazonaws.com/${textureNames[activeLayer.type]}`;

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