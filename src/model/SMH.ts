import { LayerState, Layer } from "./Layers";
import { SmileyMap } from "./SmileyMap";
import { Viewport } from "./Viewport";

export class SMH {

    map: SmileyMap | null;
    activeLayer: LayerState;
    selectedTileIndex: number;
    layers: Map<Layer, LayerState>;
    viewport: Viewport;

    constructor() {
    }
};

export const smh = new SMH();