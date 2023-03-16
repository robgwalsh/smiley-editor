/**
 * The structure of the JSON file format. Can be converted to and from a MapState.
 */
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
    textures: Texture[];
}

export interface Texture {
    /**
     * file path(s) or url(s) to the image file containing the in-game tiles.
     */
    tilesetPaths: string[];
    /**
     * For fringe textures, this is a file path or url to the image to show as the tile picker
     * in the editor. Should be omitted for Normal textures, which use the same tileset image
     * in-game and in the editor
     */
    editorPath: string;
    textureType: TextureType;
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