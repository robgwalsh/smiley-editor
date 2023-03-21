import React from "react";
import { useAppSelector } from "../hooks";
import { TilePalleteButton } from "./TilePaletteButton";

export function TilePalette() {

    const state = useAppSelector(state => state.editor);

    const drawOrder = ["lmb", "mmb", "rmb", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

    return (
        <div style={{ display: "flex" }}>
            {drawOrder.map(input =>
                <TilePalleteButton key={input} button={input} />
            )}
        </div>
    )
}