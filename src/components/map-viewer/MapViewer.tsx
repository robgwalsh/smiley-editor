import React, { useLayoutEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { EditorState } from "../../model/EditorState";
import { useMap } from "../../model/SmileyMap";
import { Vector } from "../../model/Vector";
import { Viewport } from "../../model/Viewport";
import { setViewportSize } from "../../store/reducers/editor-slice";
import { MapCell } from "./MapCell";

export function MapViewer() {
    const { viewport, cellDiameter } = useAppSelector<EditorState>(state => state.editor);

    const dispatch = useAppDispatch();
    const map = useMap();

    const containerRef = useRef(null);

    useLayoutEffect(() => {
        if (containerRef.current) {
            const width = (containerRef.current as any).clientWidth;
            const height = (containerRef.current as any).clientHeight;
            if (viewport.width !== width || viewport.height !== height) {
                dispatch(setViewportSize(new Vector(width, height)));
            }
        }
    });

    if (!map)
        return <></>

    return (
        <div style={{ position: "relative", height: "100%" }} ref={containerRef}>
            {getVisibleCells(viewport, cellDiameter).map(cell =>
                <MapCell
                    key={`${cell.x},${cell.y}`}
                    position={cell}
                />
            )}
        </div>
    )
}

function getVisibleCells(viewport: Viewport, cellDiameter: number): Vector[] {
    const cells: Vector[] = [];

    if (viewport.width <= 0 || viewport.height <= 0)
        return cells;

    const leftTile = viewport.x / cellDiameter;
    const rightTile = (viewport.x + viewport.width) / cellDiameter;
    const topTile = viewport.y / cellDiameter;
    const bottomTile = (viewport.y + viewport.height) / cellDiameter;

    for (let x = leftTile; x <= rightTile; x++) {
        for (let y = topTile; y <= bottomTile; y++) {
            cells.push(new Vector(x * cellDiameter, y * cellDiameter));
        }
    }
    return cells;
}