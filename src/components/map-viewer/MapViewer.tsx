import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useWheelZoom } from "../../hooks/useWheelZoom";
import { EditorState } from "../../model/EditorState";
import { MapData, useMapData } from "../../model/map/MapData";
import { Texture, Textures } from "../../model/Textures";
import { Vector } from "../../model/Vector";
import { setMouseOnMap, setMousePosition, setViewportSize, zoomAtMouse as zoomAtCursor } from "../../store/reducers/editor-slice";

export function MapViewer() {
    const state: EditorState = useAppSelector(state => state.editor);
    const mapData: MapData = useMapData();
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
        if (state.map && canvasRef.current) {
            const cx: CanvasRenderingContext2D = canvasRef.current.getContext('2d');
            cx.imageSmoothingEnabled = false;
            cx.transform(
                state.viewport.zoom,  // x scaling
                0,                    // x skewing
                0,                    // y skewing
                state.viewport.zoom,  // y scaling
                -state.viewport.x,    // x offset
                -state.viewport.y);   // y offset
            render(cx, state, mapData);
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

function render(cx: CanvasRenderingContext2D, state: EditorState, mapData: MapData) {
    cx.clearRect(0, 0, state.viewport.width, state.viewport.height);
    for (const visualLayer of state.map.visualLayers) {
        renderLayer(cx, state, mapData.layers.get(visualLayer.name));
    }
    renderLayer(cx, state, mapData.layers.get(state.map.walkLayer.name));
    renderLayer(cx, state, mapData.layers.get(state.map.itemLayer.name));
    renderLayer(cx, state, mapData.layers.get(state.map.enemyLayer.name));
}

function renderLayer(cx: CanvasRenderingContext2D, state: EditorState, layer: Int16Array) {
    if (!layer) {
        throw new Error("'layer' cant be null");
    }
    if (state.viewport.width <= 0 || state.viewport.height <= 0)
        return;

    const vp = state.viewport;

    const tileWidth = state.map.header.tileWidth;
    const tileHeight = state.map.header.tileHeight;

    const leftTile = Math.round(vp.x / vp.zoom / tileWidth);
    const rightTile = Math.round((vp.x + vp.width) / vp.zoom / tileWidth);
    const topTile = Math.round(vp.y / vp.zoom / tileHeight);
    const bottomTile = Math.round((vp.y + vp.height) / vp.zoom / tileHeight);

    for (let x = leftTile; x <= rightTile; x++) {
        for (let y = topTile; y <= bottomTile; y++) {
            const index = y * state.map.header.width + x;

            // Each cell in the matrix has 2 int16s: the first is the index of the texture, the second
            // is the index of the tile within that texture.
            const textureIndex = layer[index * 2];
            const tile = layer[index * 2 + 1];
            if (tile > 1) {
                const texture: Texture = Textures.getTexture(state.map.header.textures[textureIndex].name);
                texture.drawTile(cx, tile,
                    x * tileWidth - vp.x,
                    y * tileHeight - vp.y);
            }
        }
    }
}