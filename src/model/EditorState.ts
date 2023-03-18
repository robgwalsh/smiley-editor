import { MapState } from "./map/MapState";
import { Viewport } from "./Viewport";

export interface EditorState {
    map: MapState;
    isLoadingMap: boolean;
    activeLayerName;
    selectedTileIndex: number;
    selectedTextureName: string;
    selectedTextureIndex: number;
    viewport: Viewport;
    revision: number;
    mouseX: number;
    mouseY: number;
    mouseOnMap: boolean;
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
        viewport: {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            zoom: 1
        }
    };
}