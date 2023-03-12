import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { EditorState, Layer } from "../../model/EditorState";
import { SmileyMap, useMap } from "../../model/SmileyMap";
import { Textures } from "../../model/Textures";
import { Vector } from "../../model/Vector";
import { Viewport } from "../../model/Viewport";
import { setViewportSize } from "../../store/reducers/editor-slice";

export function MapViewer() {

    const editorState = useAppSelector<EditorState>(state => state.editor);
    const map = useMap();
    const dispatch = useAppDispatch();

    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    // Synchronize the canvas size to available size
    if (containerRef.current && canvasRef.current) {
        const width = (containerRef.current as any).clientWidth;
        const height = (containerRef.current as any).clientHeight;
        //console.log(`${width}x${height} canvas: ${canvasRef.current.width}x${canvasRef.current.height}`);
        if (canvasRef.current.width !== width)
            canvasRef.current.width = width;
        if (canvasRef.current.height !== editorState.viewport.height)
            canvasRef.current.height = height;
    }

    // Listen to size changes
    useLayoutEffect(() => {
        const resizeListener = () => dispatch(setViewportSize(new Vector(window.innerWidth, window.innerHeight)));
        resizeListener();
        window.addEventListener('resize', resizeListener);
        return () => window.removeEventListener('resize', resizeListener);
    }, []);

    useEffect(() => {
        if (map && canvasRef.current) {
            render(canvasRef.current.getContext('2d'), map, editorState);
        }
    });

    return (
        <div style={{ position: "relative", overflow: "hidden", height: "100%" }} ref={containerRef}>
            <canvas style={{ position: "absolute", left: 0, top: 0 }} ref={canvasRef}></canvas>
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
            texture.drawTile(cx, tile, x, y, state.viewport.zoom);
        }
    }
}

function getVisibleCells(viewport: Viewport, cellDiameter: number): Vector[] {
    const cells: Vector[] = [];

    if (viewport.width <= 0 || viewport.height <= 0)
        return cells;

    const leftTile = Math.round(viewport.x / cellDiameter);
    const rightTile = Math.round((viewport.x + viewport.width) / cellDiameter);
    const topTile = Math.round(viewport.y / cellDiameter);
    const bottomTile = Math.round((viewport.y + viewport.height) / cellDiameter);

    for (let x = leftTile; x <= rightTile; x++) {
        for (let y = topTile; y <= bottomTile; y++) {
            cells.push(new Vector(x, y));
        }
    }
    return cells;
}