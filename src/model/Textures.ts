export class DefaultTextures {
    public static readonly mainLayer = ["https://smiley-editor.s3.amazonaws.com/mainlayer.png"];
    public static readonly walkLayer = ["https://smiley-editor.s3.amazonaws.com/walklayer.PNG"];
    public static readonly itemLayer = [
        "https://smiley-editor.s3.amazonaws.com/itemlayer1.png",
        "https://smiley-editor.s3.amazonaws.com/itemlayer2.png"
    ];
    public static readonly enemyLayer = ["https://smiley-editor.s3.amazonaws.com/enemylayer.PNG"];
}

export class Textures {

    private static readonly _textures = new Map<string, Texture>();

    public static initializeDefaultTextures() {
        this.initializeTexture(DefaultTextures.mainLayer, 16, 16);
        this.initializeTexture(DefaultTextures.walkLayer, 16, 16);
        this.initializeTexture(DefaultTextures.itemLayer, 16, 16);
        this.initializeTexture(DefaultTextures.enemyLayer, 16, 16);
    }

    public static initializeTexture(urls: string[], width: number, height: number, force = false) {
        if (force || !this._textures.get(urls[0])) {
            this._textures.set(urls[0], new Texture(urls, width, height));
        }
    }

    public static getTexture(url: string): Texture {
        const texture = this._textures.get(url);
        if (!texture) {
            throw new Error(`there is no texture for ${url}`);
        }
        return texture;
    }
}

export class Texture {

    private readonly _images: HTMLImageElement[];

    /**
     * @param urls url of each image in the texture
     * @param width number of tiles per row
     * @param height number of rows
     */
    constructor(public readonly urls: string[], public readonly width, public readonly height) {
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

Textures.initializeDefaultTextures();