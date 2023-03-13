import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useWheelZoom } from "../../hooks/useWheelZoom";
import { EditorState, Layer } from "../../model/EditorState";
import { SmileyMap, useMap } from "../../model/SmileyMap";
import { Textures } from "../../model/Textures";
import { Vector } from "../../model/Vector";
import { Viewport } from "../../model/Viewport";
import { setMouseOnMap, setMousePosition, setViewportSize, zoomAtMouse as zoomAtCursor } from "../../store/reducers/editor-slice";

export function MapViewer() {

    const state = useAppSelector<EditorState>(state => state.editor);
    const map = useMap();
    const dispatch = useAppDispatch();

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Synchronize the canvas size to available size
    if (containerRef.current && canvasRef.current) {
        const width = (containerRef.current as any).clientWidth;
        const height = (containerRef.current as any).clientHeight;
        if (canvasRef.current.width !== width)
            canvasRef.current.width = width;
        if (canvasRef.current.height !== state.viewport.height)
            canvasRef.current.height = height;
    }

    // Listen to size changes
    useLayoutEffect(() => {
        const observer = new ResizeObserver((entries) => {
            dispatch(setViewportSize(new Vector(entries[0].contentRect.width, entries[0].contentRect.height)));
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useWheelZoom((e: WheelEvent) => {
        if (e.deltaY !== 0 || e.deltaX !== 0) {
            dispatch(zoomAtCursor(e.deltaY < 0 || e.deltaX < 0));
        }
    });

    const handleMouseMove = (e) => {
        const box: DOMRect = containerRef.current.getBoundingClientRect();
        dispatch(setMousePosition(new Vector(
            e.clientX - box.left,
            e.clientY - box.top
        )));
    };

    useEffect(() => {
        if (map && canvasRef.current) {
            const cx: CanvasRenderingContext2D = canvasRef.current.getContext('2d');
            cx.imageSmoothingEnabled = false;
            cx.transform(
                state.viewport.zoom,  // x scaling
                0,                    // x skewing
                0,                    // y skewing
                state.viewport.zoom,  // y scaling
                -state.viewport.x,    // x offset
                -state.viewport.y);   // y offset
            render(cx, map, state);
        }
    });

    return (
        <div
            style={{ position: "relative", overflow: "hidden", height: "100%" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={(e) => dispatch(setMouseOnMap(true))}
            onMouseLeave={(e) => dispatch(setMouseOnMap(false))}
            ref={containerRef}
        >
            <canvas
                style={{ position: "absolute", left: 0, top: 0 }}
                ref={canvasRef}>
            </canvas>
        </div>
    )
}

function render(cx: CanvasRenderingContext2D, map: SmileyMap, state: EditorState) {

    const cells: Vector[] = getVisibleCells(state.viewport, state.cellDiameter);

    renderLayer(cx, cells, Layer.Main, map, state);
    renderLayer(cx, cells, Layer.Walk, map, state);
    renderLayer(cx, cells, Layer.Item, map, state);
    //renderLayer(cx, cells, Layer.Enemy, map, state);
}

function renderLayer(cx: CanvasRenderingContext2D, cells: Vector[], layer: Layer, map: SmileyMap, state: EditorState) {
    for (const v of cells) {
        const tile = map.layers[layer][v.y * map.w + v.x];
        if (tile >= 0) {
            const texture = Textures.getTexture(layer, Math.floor(tile / 256));
            const x = v.x * state.cellDiameter - state.viewport.x;
            const y = v.y * state.cellDiameter - state.viewport.y;
            texture.drawTile(cx, tile, x, y);
        }
    }
}

function getVisibleCells(viewport: Viewport, cellDiameter: number): Vector[] {
    const cells: Vector[] = [];

    if (viewport.width <= 0 || viewport.height <= 0)
        return cells;

    const leftTile = Math.round(viewport.x / viewport.zoom / cellDiameter);
    const rightTile = Math.round((viewport.x + viewport.width) / viewport.zoom / cellDiameter);
    const topTile = Math.round(viewport.y / viewport.zoom / cellDiameter);
    const bottomTile = Math.round((viewport.y + viewport.height) / viewport.zoom / cellDiameter);

    for (let x = leftTile; x <= rightTile; x++) {
        for (let y = topTile; y <= bottomTile; y++) {
            cells.push(new Vector(x, y));
        }
    }
    return cells;
}