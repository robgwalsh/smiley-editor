import { MapFileTexture, TextureType } from "./map/MapFile";

export class Textures {
    private static readonly _textures = new Map<string, Texture>();

    public static async initializeTextureAsync(texture: MapFileTexture, force = false): Promise<void> {
        if (force || !this._textures.get(texture.name)) {
            const tx = await Texture.createAsync(texture);
            this._textures.set(texture.name, tx);
        }
    }

    public static getTexture(name: string): Texture {
        const texture = this._textures.get(name);
        if (!texture)
            throw new Error(`texture not found: ${name}`);
        return texture;
    }
}

export class Texture {
    private constructor(
        public readonly info: MapFileTexture,
        private readonly _images: HTMLImageElement[]) {
    }

    public static async createAsync(textureInfo: MapFileTexture): Promise<Texture> {
        const promises: Promise<HTMLImageElement>[] =
            textureInfo.tilesetPaths
                .map(url => new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = document.createElement('img');
                    img.width = textureInfo.width;
                    img.height = textureInfo.height;
                    img.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
                        reject(`${source} ${lineno} ${colno} ${error.message}`);
                    };
                    img.onload = (e) => resolve(img);
                    img.src = url;
                }));

        const images: HTMLImageElement[] = [];
        for (const p of promises) {
            images.push(await p);
        }

        return new Texture(textureInfo, images);
    }

    public drawTile(
        cx: CanvasRenderingContext2D,
        tile: number,
        x: number,
        y: number) {

        if (this.info.textureType === TextureType.Fringe) {
            // TODO:
        }

        const tilesWide = this.info.width / this.info.tileWidth;
        const tilesHigh = this.info.height / this.info.tileHeight

        const n = (tilesWide * tilesHigh);
        const imageIndex = tile % n;
        const tileX = (tile % tilesWide) * this.info.tileWidth;
        const tileY = Math.round((tile % n) / tilesHigh) * this.info.tileHeight;

        const image = this._images[imageIndex];
        if (!image) {
            throw new Error('texture image not loaded yet :O');
        }

        cx.drawImage(
            image,
            tileX, tileY,   // source x, y
            64, 64,         // source width,height
            x, y,           // destination x, y
            64, 64);        // destination width, height
    }
}