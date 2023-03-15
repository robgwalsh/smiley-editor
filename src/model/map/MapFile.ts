export interface MapFile {
    header: MapHeader,
    idLayer: MapFileLayer,
    variableLayer: MapFileLayer,
    walkLayer: MapFileLayer,
    itemLayer: MapFileLayer,
    enemyLayer: MapFileLayer,
    visualLayers: MapFileVisualLayer[];
}

export interface MapHeader {
    width: number;
    height: number;
    song: string;
    idStart: number;
}

export interface MapFileLayer {
    dataBase64: string;
}

export enum VisualLayerType {
    Normal = 0,
    Fringe = 1,
    Legacy = 2,
}

export interface MapFileVisualLayer extends MapFileLayer {
    type: VisualLayerType;
    index: number;
}