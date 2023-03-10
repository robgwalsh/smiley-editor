import { LayerState, Layer } from "./Layers";
import { SmileyMap } from "./SmileyMap";
import { Viewport } from "./Viewport";

export interface EditorState {
    map: SmileyMap | null;
    activeLayer: LayerState;
    selectedTileIndex: number;
    layers: Map<Layer, LayerState>;
    viewport: Viewport;
}

export class EditorStateFactory {
    static initialState() {
        const initialState: EditorState = {
            map: null,
            activeLayer: null,
            selectedTileIndex: 1,
            layers: new Map<Layer, LayerState>(),
            viewport: new Viewport()
        };

        const mainLayer: LayerState = {
            type: Layer.Main,
            index: 0,
            name: "Main",
            visible: true
        };

        initialState.activeLayer = mainLayer;
        initialState.layers.set(Layer.Main, mainLayer);

        return initialState;
    }
}