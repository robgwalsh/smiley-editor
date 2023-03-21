import Button from "@mui/material/Button";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Textures } from "../model/Textures";
import { handleInput } from "../store/editor-slice";

interface Props {
    button: string;
}

export function TilePalleteButton(props: Props) {

    const state = useAppSelector(state => state.editor);
    const selection = state.tileSelections[props.button];

    if (props.button === "lmb") {
        console.log("hello world");
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (selection?.tile && canvasRef.current) {
            const cx = canvasRef.current.getContext('2d');
            const texture = Textures.getTexture(state.map.header.textures.find(t => t.id === selection.textureId).name);
            texture.drawSprite(cx, selection.tile, { x: 0, y: 0, width: 64, height: 64 });
        }
    });

    return (
        <div
            style={{
                width: "64px",
                position: "relative",
                height: "64px",
                border: "1px solid #232323"
            }}
        >
            <canvas
                ref={canvasRef}
                width={64}
                height={64}
                style={{ position: "absolute", left: 0, top: 0 }}
            />
            <div style={{ position: "absolute", left: 0, top: 0 }}>
                {props.button}
            </div>
        </div>
    )
}