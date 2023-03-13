import { Layer } from "./EditorState";

export class Textures {

    private static readonly _textures = new Map<string, Texture>();

    static initializeTextures() {
        this.initializeTexture(Layer.Main, 0, "https://smiley-editor.s3.amazonaws.com/mainlayer.png");
        this.initializeTexture(Layer.Walk, 0, "https://smiley-editor.s3.amazonaws.com/walklayer.PNG");
        this.initializeTexture(Layer.Item, 0, "https://smiley-editor.s3.amazonaws.com/itemlayer1.png");
        this.initializeTexture(Layer.Item, 1, "https://smiley-editor.s3.amazonaws.com/itemlayer2.png");
        this.initializeTexture(Layer.Enemy, 0, "https://smiley-editor.s3.amazonaws.com/enemylayer.PNG");
    }

    static initializeTexture(layer: Layer, index: number, url: string) {
        this._textures.set(`${layer}_${index}`, new Texture(url));
    }

    public static getTexture(layer: Layer, index: number): Texture {
        const texture = this._textures.get(`${layer}_${index}`);
        if (!texture) {
            throw new Error(`there is no texture for ${layer}.${index}`);
        }
        return texture;
    }
}

export class Texture {

    private readonly _img: HTMLImageElement;

    constructor(public readonly url: string) {
        this._img = document.createElement('img');
        this._img.width = 1024;
        this._img.height = 1024;
        this._img.src = url;
    }

    public drawTile(
        cx: CanvasRenderingContext2D,
        tile: number,
        x: number,
        y: number,
        zoom: number) {

        const tileX = (tile % 16) * 64;
        const tileY = Math.round(tile / 16) * 64;

        cx.drawImage(this._img,
            tileX, tileY,   // source x, y
            64, 64,         // source width,height
            Math.round(x * zoom), Math.round(y * zoom),     // destination x, y
            Math.round(64 * zoom), Math.round(64 * zoom));  // destination width, height
    }
}

Textures.initializeTextures();