import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useWheelZoom } from "../../hooks/useWheelZoom";
import { EditorState } from "../../model/EditorState";
import { MapData, useMapData } from "../../model/map/MapData";
import { MapError } from "../../model/map/MapError";
import { LayerType } from "../../model/map/MapState";
import { Texture, Textures } from "../../model/Textures";
import { Vector } from "../../model/Vector";
import { setMouseOnMap, setViewportSize, zoomAtMouse as zoomAtCursor } from "../../store/editor-slice";
import { MapEventHandler } from "./MapEventHandler";

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

    // Do initial event setup on first render
    useLayoutEffect(() => {

        console.log("fist render");

        const eventHandler = new MapEventHandler(containerRef.current, dispatch);

        const observer = new ResizeObserver((entries) => {
            dispatch(setViewportSize(new Vector(entries[0].contentRect.width, entries[0].contentRect.height)));
        });
        observer.observe(containerRef.current);

        return () => {
            console.log("mapviewer cleanup");
            observer.disconnect();
            eventHandler.dispose();
        };
    }, []);

    useWheelZoom((e: WheelEvent) => {
        if (e.deltaY !== 0 || e.deltaX !== 0) {
            dispatch(zoomAtCursor(e.deltaY < 0 || e.deltaX < 0));
        }
    });

    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    useEffect(() => {
        if (state.map && canvasRef.current) {
            const cx: CanvasRenderingContext2D = canvasRef.current.getContext('2d');
            cx.imageSmoothingEnabled = false;
            render(cx, state, mapData);
        }
    });

    return (
        <div
            style={{ position: "relative", overflow: "hidden", height: "100%" }}
            onContextMenu={handleContextMenu}
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
        renderLayer(cx, state, mapData.layers.get(visualLayer.name), LayerType.Visual);
    }
    renderLayer(cx, state, mapData.layers.get(state.map.walkLayer.name), LayerType.Walk);
    renderLayer(cx, state, mapData.layers.get(state.map.itemLayer.name), LayerType.Item);
    renderLayer(cx, state, mapData.layers.get(state.map.enemyLayer.name), LayerType.Enemy);
}

function renderLayer(cx: CanvasRenderingContext2D, state: EditorState, layer: Int16Array, layerType: LayerType) {
    if (!layer) {
        throw new Error("'layer' cant be null");
    }
    if (state.viewport.width <= 0 || state.viewport.height <= 0)
        return;

    const vp = state.viewport;

    const tileWidth = state.map.header.tileWidth;
    const tileHeight = state.map.header.tileHeight;

    const leftTile = Math.max(0, Math.floor(vp.x / state.zoom / tileWidth)) - 1;
    const rightTile = Math.min(state.map.header.width - 1, Math.ceil((vp.x + vp.width) / state.zoom / tileWidth));
    const topTile = Math.max(0, Math.floor(vp.y / state.zoom / tileHeight)) - 1;
    const bottomTile = Math.min(state.map.header.height - 1, Math.ceil((vp.y + vp.height) / state.zoom / tileHeight));

    for (let tileX = leftTile; tileX <= rightTile; tileX++) {
        for (let tileY = topTile; tileY <= bottomTile; tileY++) {
            const index = tileY * state.map.header.width + tileX;

            // Each cell in the matrix has 2 int16s: the first is the id of the texture, the second
            // is the index of the tile within that texture.
            const textureId = layer[index * 2];
            const tile = layer[index * 2 + 1];
            if (tile > 1) {
                const textureInfo = state.map.header.textures.find(t => t.id === textureId);
                if (!textureInfo)
                    throw new MapError(`${layerType} layer ${tileX}, ${tileY} points to texture ${textureId} which doesn't exist`);

                const texture: Texture = Textures.getTexture(state.map.header.textures[textureId].name);
                texture.drawTile(cx, tile,
                    state.zoom * (tileX * tileWidth) - vp.x,
                    state.zoom * (tileY * tileHeight) - vp.y,
                    state.zoom
                );
            }
        }
    }
}