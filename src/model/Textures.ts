import { Box } from "./EditorState";
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

    public drawSprite(cx: CanvasRenderingContext2D, index: number, dst: Box) {

        if (this.info.textureType === TextureType.Fringe) {
            // TODO:
        }

        const tilesWide = this.info.width / this.info.tileWidth;
        const tilesHigh = this.info.height / this.info.tileHeight

        const n = (tilesWide * tilesHigh);
        const imageIndex = Math.floor(index / n);
        const tileX = (index % tilesWide) * this.info.tileWidth;
        const tileY = Math.floor((index % n) / tilesHigh) * this.info.tileHeight;

        const image = this._images[imageIndex];
        if (!image) {
            throw new Error('texture image not loaded yet :O');
        }

        cx.drawImage(
            image,
            tileX, tileY, this.info.tileWidth, this.info.tileHeight,    // source box
            dst.x, dst.y, dst.width, dst.height);                       // target box
    }
}