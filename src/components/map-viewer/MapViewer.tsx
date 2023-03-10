import React, { useLayoutEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { EditorState } from "../../model/EditorState";
import { Vector } from "../../model/Vector";
import { Viewport } from "../../model/Viewport";
import { setViewportSize } from "../../store/reducers/editor-slice";
import { MapCell } from "./MapCell";

export function MapViewer() {
    const { map, viewport } = useAppSelector<EditorState>(state => state.editor);

    const dispatch = useAppDispatch();

    const containerRef = useRef(null);

    useLayoutEffect(() => {
        if (containerRef.current) {
            const width = (containerRef.current as any).clientWidth;
            const height = (containerRef.current as any).clientHeight;
            if (viewport.size.x !== width || viewport.size.y !== height) {
                dispatch(setViewportSize(new Vector(width, height)));
            }
        }
    });

    if (!map)
        return <></>

    return (
        <div style={{ position: "relative" }} ref={containerRef}>
            {viewport.getVisibleCells().map(cell => <MapCell position={cell} />)}
        </div>
    )
}

const cellDiameter = 64;