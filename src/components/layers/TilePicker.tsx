import React, { useState } from "react";
import { useAppSelector } from "../../hooks";
import { EditorState, Layer } from "../../model/EditorState";
import { Textures } from "../../model/Textures";

export function TilePicker() {

    const { activeLayer, selectedTileIndex } = useAppSelector<EditorState>(state => state.editor);
    const [textureIndex, setTextureIndex] = useState<number>(0);

    const hasTexture = activeLayer.layer !== Layer.Id && activeLayer.layer !== Layer.Variable;

    return (
        <div>
            {hasTexture
                ?
                <img
                    width={500}
                    style={{ objectFit: "contain" }}
                    src={Textures.getTexture(activeLayer.layer, textureIndex).url}
                />
                :
                <div style={{ width: "500px", height: "500px", border: ".5px solid #efefef" }}>
                    {activeLayer.layer} - no texture!
                </div>
            }
        </div>
    )
}