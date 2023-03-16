import { MapState } from "./map/MapState";
import { Viewport } from "./Viewport";

export interface EditorState {
    map: MapState;
    activeLayerName;
    selectedTileIndex: number;
    viewport: Viewport;
    cellDiameter: number;
    revision: number;
    mouseX: number;
    mouseY: number;
    mouseOnMap: boolean;
}

export function initialEditorState(): EditorState {
    return {
        activeLayerName: null,
        map: null,
        mouseOnMap: false,
        mouseX: 0,
        mouseY: 0,
        selectedTileIndex: 1,
        revision: 0,
        cellDiameter: 64,
        viewport: {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            zoom: 1
        }
    };
}