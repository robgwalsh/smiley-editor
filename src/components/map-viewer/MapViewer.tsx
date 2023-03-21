import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useWheelZoom } from "../../hooks/useWheelZoom";
import { EditorState } from "../../model/EditorState";
import { MapData, getMapData } from "../../model/map/MapData";
import { setMapMousePosition, setViewportSize, zoomAtMouse as zoomAtCursor } from "../../store/editor-slice";
import { TilePalette } from "../TilePalette";
import { MapEventHandler } from "./MapEventHandler";
import { MapRenderer } from "./MapRenderer";

export function MapViewer() {
    const state: EditorState = useAppSelector(state => state.editor);
    const mapData: MapData = getMapData();
    const dispatch = useAppDispatch();

    const [renderer, setRenderer] = useState<MapRenderer | null>(null);
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
        const eventHandler = new MapEventHandler(containerRef.current, dispatch);
        setRenderer(new MapRenderer(canvasRef.current));
        const observer = new ResizeObserver((entries) => {
            dispatch(setViewportSize({
                x: entries[0].contentRect.width,
                y: entries[0].contentRect.height
            }));
        });
        observer.observe(containerRef.current);
        return () => {
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
        if (state.map && renderer) {
            renderer.render(state, mapData);
        }
    });

    return (
        <div
            style={{
                position: "relative",
                overflow: "hidden",
                height: "100%"
            }}
            onContextMenu={handleContextMenu}
            onMouseLeave={(e) => dispatch(setMapMousePosition(null))}
            ref={containerRef}
        >
            <canvas
                style={{ position: "absolute", left: 0, top: 0 }}
                ref={canvasRef}>
            </canvas>

            <div
                style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    paddingBottom: "20px"
                }}
            >
                <TilePalette />
            </div>
        </div>
    )
}