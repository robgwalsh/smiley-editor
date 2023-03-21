import { LayerState, LayerType, MapState } from "./map/MapState";
import { IVector } from "./Vector";

export class EditorState {
    map: MapState | null;
    isLoadingMap: boolean;
    selectedLayerName: string | null;
    selectedTextureName: string | null;
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
    /**
     * Current mouse position on the map in screen coordinates, or null if its off the map
     */
    mapMousePosition: IVector | null;
    tilePickerGridPosition: IVector | null;
    /**
     * Selections applied to the toolbar/palette
     */
    tileSelections: {[key: string]: TileSelection | null};
}

export interface TileSelection {
    x: number;  // tile X within the image
    y: number;  // tile y within the image
    textureId: number | undefined;
    tile: number | undefined;
    layerName: string | undefined;   // If associated with a layer
}

export interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function initialEditorState(): EditorState {
    return {
        selectedLayerName: null,
        selectedTextureName: null,
        selectedTextureIndex: 0,
        map: null,
        mapMousePosition: null,
        isLoadingMap: false,
        revision: 0,
        viewport: { x: 0, y: 0, width: 0, height: 0 },
        zoom: 1,
        tilePickerGridPosition: null,
        tileSelections: {
            "lmb": null,
            "mmb": null,
            "rmb": null,
            "1": null,
            "2": null,
            "3": null,
            "4": null,
            "5": null,
            "6": null,
            "7": null,
            "8": null,
            "9": null,
            "0": null,
        }
    };
}