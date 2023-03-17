/**
 * The structure of the JSON file format. Can be converted to and from a MapState.
 */
export interface MapFile {
    header: MapFileHeader,
    idLayer: MapFileLayer,
    variableLayer: MapFileLayer,
    walkLayer: MapFileLayer,
    itemLayer: MapFileLayer,
    enemyLayer: MapFileLayer,
    visualLayers: MapFileVisualLayer[];
}

export interface MapFileHeader {
    width: number;
    height: number;
    tileWidth: number;
    tileHeight: number;
    song: string;
    idStart: number;
    textures: MapFileTexture[];
}

export interface MapFileTexture {
    name: string;
    id: number;
    width: number;
    height: number;
    tileWidth: number;
    tileHeight: number;
    /**
     * file path(s) or url(s) to the image file containing the in-game tiles.
     */
    tilesetPaths: string[];
    textureType: TextureType; // TODO: should there instead be a fringeCount or something? Not sure if the algorithm could support i.e. 4 or 8 fringe tiles
}

export interface MapFileLayer {
    dataBase64: string;
}

export enum TextureType {
    Normal = 0,
    Fringe = 1
}

export interface MapFileVisualLayer extends MapFileLayer {
    index: number;
}