import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useWheelZoom } from "../../hooks/useWheelZoom";
import { EditorState, Layer } from "../../model/EditorState";
import { SmileyMap, useMap } from "../../model/SmileyMap";
import { Textures } from "../../model/Textures";
import { Vector } from "../../model/Vector";
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

    cx.clearRect(0, 0, state.viewport.width, state.viewport.height);

    renderLayer(cx, Layer.Main, map, state);
    renderLayer(cx, Layer.Walk, map, state);
    renderLayer(cx, Layer.Item, map, state);
    //renderLayer(cx, cells, Layer.Enemy, map, state);
}

function renderLayer(cx: CanvasRenderingContext2D, layer: Layer, map: SmileyMap, state: EditorState) {

    if (state.viewport.width <= 0 || state.viewport.height <= 0)
        return;

    const vp = state.viewport;

    const leftTile = Math.round(vp.x / vp.zoom / state.cellDiameter);
    const rightTile = Math.round((vp.x + vp.width) / vp.zoom / state.cellDiameter);
    const topTile = Math.round(vp.y / vp.zoom / state.cellDiameter);
    const bottomTile = Math.round((vp.y + vp.height) / vp.zoom / state.cellDiameter);

    for (let x = leftTile; x <= rightTile; x++) {
        for (let y = topTile; y <= bottomTile; y++) {
            const tile = map.layers[layer][y * map.w + x];
            if (tile > 1) {
                const texture = Textures.getTexture(layer, Math.floor(tile / 256));
                texture.drawTile(cx, tile,
                    x * state.cellDiameter - vp.x,
                    y * state.cellDiameter - vp.y);
            }
        }
    }
}