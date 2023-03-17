import { MapFileTexture, TextureType } from "./map/MapFile";

export class Textures {
    private static readonly _textures = new Map<string, Texture>();

    public static initializeTextures(texture: MapFileTexture, force = false) {
        if (force || !this._textures.get(texture.name)) {
            this._textures.set(`${texture.name}_tileset`, new Texture(texture.tilesetPaths, texture.width, texture.height, texture.textureType));
            if (texture.editorPath) {
                this._textures.set(`${texture.name}_editor`, new Texture([texture.editorPath], texture.width, texture.height, texture.textureType));
            }
        }
    }

    public static getTilesetTexture(name: string): Texture {
        const texture = this._textures.get(`${name}_tileset`)
        if (!texture)
            throw new Error(`texture not found: ${name}`);
        return texture;
    }

    public static getEditorTexture(name: string): Texture {
        return this._textures.get(`${name}_editor`) ?? this._textures.get(`${name}_tileset`);
    }
}

export class Texture {

    private readonly _images: HTMLImageElement[];

    /**
     * @param urls url of each image in the texture
     * @param width number of tiles per row
     * @param height number of rows
     */
    constructor(public readonly urls: string[], public readonly width, public readonly height, public readonly type: TextureType) {
        this._images = urls.map(url => {
            const img = document.createElement('img');
            img.width = 1024;
            img.height = 1024;
            img.src = url;
            return img;
        });
    }

    public drawTile(
        cx: CanvasRenderingContext2D,
        tile: number,
        x: number,
        y: number) {

        if (this.type === TextureType.Fringe) {
            // TODO:
        }

        const n = (this.width * this.height);
        const imageIndex = tile % n;
        const tileX = (tile % 16) * 64;
        const tileY = Math.round((tile % n) / 16) * 64;

        cx.drawImage(
            this._images[imageIndex],
            tileX, tileY,   // source x, y
            64, 64,         // source width,height
            x, y,           // destination x, y
            64, 64);        // destination width, height
    }
}