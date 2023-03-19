import { LayerState, MapState } from "./map/MapState";

export class EditorState {
    map: MapState;
    isLoadingMap: boolean;
    activeLayerName;
    selectedTileIndex: number;
    selectedTextureName: string;
    selectedTextureIndex: number;
    /**
     * Current viewport, in screen pixels.
     */
    viewport: Box;
    /**
     * Percentage zoom (1 == 100%, where a 64x64 tile takes up 64x64 screen pixels).
     */
    zoom: number;
    revision: number;
    mouseX: number;
    mouseY: number;
    mouseOnMap: boolean;
}

export interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function initialEditorState(): EditorState {
    return {
        activeLayerName: null,
        selectedTextureName: null,
        selectedTextureIndex: 0,
        map: null,
        isLoadingMap: false,
        mouseOnMap: false,
        mouseX: 0,
        mouseY: 0,
        selectedTileIndex: 1,
        revision: 0,
        viewport: { x: 0, y: 0, width: 0, height: 0 },
        zoom: 1
    };
}