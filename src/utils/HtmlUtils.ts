import { Vector } from "../model/Vector";

export class HtmlUtils {
    /**
     * Saves the contents of the given canvas to a .png
     *
     * @param canvas - the canvas to save
     * @param backgroundColor - background color (defaults to white) or null to use the canvas as-is
     */
    public static downloadCanvasAsImage(canvas: HTMLCanvasElement, backgroundColor: string = '#ffffff') {
        let dataUrl: string;
        if (backgroundColor) {
            const c = HtmlUtils.createHtmlCanvas(canvas.width, canvas.height);
            const cx = c.getContext('2d');
            cx.fillStyle = backgroundColor;
            cx.fillRect(0, 0, canvas.width, canvas.height);
            cx.drawImage(canvas, 0, 0);
            dataUrl = c.toDataURL('image/png');
        } else {
            dataUrl = canvas.toDataURL('image/png');
        }
        HtmlUtils.downloadFile(dataUrl, 'image.png');
    }

    public static createHtmlCanvas(width: number, height: number): HTMLCanvasElement {
        const result = document.createElement('canvas');
        result.width = width;
        result.height = height;
        return result;
    }

    public static getImageUrlForB64(b64: string) {
        return `data:image/png;base64,${b64}`;
    }

    public static getImageUrlForArray(array: Uint8Array) {
        const string64 = btoa(array.reduce((data, byte) => data + String.fromCharCode(byte), ''));
        return this.getImageUrlForB64(string64);
    }

    /**
     * Loads an image from a base-64 string.
     *
     * @param imageString - image base 64 string encoded
     */
    public static loadImageFromArray(array: Uint8Array): Promise<HTMLImageElement> {
        return this.loadImageFromUrl(this.getImageUrlForArray(array));
    }

    /**
     * Loads an image from a URL.
     */
    public static async loadImageFromUrl(url: string): Promise<HTMLImageElement> {
        const htmlImage = new Image();
        return new Promise<HTMLImageElement>((resolve, reject) => {
            htmlImage.crossOrigin = "Anonymous";
            htmlImage.onload = _ => resolve(htmlImage);
            htmlImage.onerror = e => reject(e);
            htmlImage.src = url;
        });
    }

    /**
     * Prompts the user to choose an image file and then loads it.
     *
     * @returns the loaded image, or null if they cancelled the file dialog.
     */
    public static async promptToLoadImageFile(supportedFormats: string): Promise<HTMLImageElement> {
        const file = await this.promptUserForFile(supportedFormats);
        if (!file)
            return null;
        return await this.loadImageFromUrl(URL.createObjectURL(file));
    }

    /**
     * Prompts the user to choose a file and then loads and returns its contents as a byte array.
     * @param acceptedFormats - comma separated list of file extensions to accept.
     */
    public static async promptToLoadBinaryFile(acceptedFormats: string): Promise<Uint8Array> {
        const file = await HtmlUtils.promptUserForFile(acceptedFormats);
        if (!file)
            return;

        return await this.readFile(file);
    }

    public static async promptToLoadTextFile(acceptedFormats: string): Promise<TextFile> {
        return new Promise(async (resolve, reject) => {
            const file = await HtmlUtils.promptUserForFile(acceptedFormats);
            const reader = new FileReader()
            reader.onload = () => resolve({
                name: file.name,
                contents: reader.result as string
            });
            reader.onerror = e => reject(e);
            reader.readAsText(file);
        });
    }

    public static readFile(file: File): Promise<Uint8Array> {
        return new Promise<Uint8Array>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = (e) => { // eslint-disable-line
                resolve(new Uint8Array(reader.result as ArrayBuffer));
                return null;
            },
                reader.onerror = e => reject(e),
                reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Downloads the given file.
     * @ param data
     * @ param fileName
     */
    public static downloadBlob(blob: Blob, fileName: string) {
        this.downloadFile(URL.createObjectURL(blob), fileName);
    }

    /**
     * Saves a byte array to a file.
     *
     * @param data
     * @param fileName
     */
    public static downloadByteArray(data: Uint8Array, fileName: string) {
        this.downloadBlob(new Blob([data]), fileName);
    }

    /**
     * Downloads the given file.
     *
     * @param data
     * @param fileName
     */
    public static downloadFile(dataUrl: string, fileName: string) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(dataUrl);
        }, 0);
    }

    /**
     * Downloads the given text as a .txt file
     * @param text
     * @param fileName
     */
    public static downloadTextAsFile(text: string, fileName: string) {
        HtmlUtils.downloadFile(`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`, fileName);
    }

    /**
     * Prompts the user to choose a file.
     *
     * @param acceptedFormats - comma separated list of file extensions to accept.
     * @returns the selected File, or null if they cancelled the file dialog.
     */
    public static async promptUserForFile(acceptedFormats: string): Promise<File> {
        return new Promise<File>((resolve, reject) => {
            const link = document.createElement('input');
            link.setAttribute('type', 'file');
            link.setAttribute('accept', acceptedFormats);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.addEventListener('input', () => {
                if (link.files.length === 0)
                    resolve(null);
                else
                    resolve(link.files[0]);
            });
            link.click();
        });
    }

    /**
     * Prompts the user to choose multiple files.
     *
     * @param acceptedFormats - comma separated list of file extensions to accept.
     * @returns the selected File, or null if they cancelled the file dialog.
     */
    public static async promptUserForFiles(acceptedFormats: string): Promise<FileList> {
        return new Promise<FileList>((resolve, reject) => {
            const link = document.createElement('input');
            link.setAttribute('type', 'file');
            link.setAttribute('multiple', 'multiple');
            link.setAttribute('accept', acceptedFormats);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.addEventListener('input', () => {
                if (link.files.length === 0)
                    resolve(null);
                else
                    resolve(link.files);
            });
            link.click();
        });
    }

    /**
     * Prompts the user to choose a file, files, or folders.
     *
     * @param acceptedFormats - comma separated list of file extensions to accept.
     * @returns the selected File, or null if they cancelled the file dialog.
     */
    public static async promptUserForFolder(acceptedFormats: string): Promise<File[]> {
        return new Promise<File[]>((resolve, reject) => {
            const link = document.createElement('input');
            link.setAttribute('type', 'file');
            link.setAttribute('webkitdirectory', '');
            link.setAttribute('accept', acceptedFormats);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.addEventListener('input', () => {
                if (link.files.length === 0)
                    resolve(null);
                else
                    resolve(Array.from((link.files)));
            });
            link.click();
        });
    }

    public static copyToClipboard(text: string) {
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        textarea.value = text;
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    public static getMousePosition(e: React.MouseEvent): Vector {
        const box: DOMRect = e.currentTarget.getBoundingClientRect();
        return new Vector(
            e.clientX - box.left,
            e.clientY - box.top
        );
    }

    public static getMouseButton(e: React.MouseEvent): MouseButton {
        switch (e.button) {
            case 1: return MouseButton.Middle;
            case 2: return MouseButton.Right;
            default: return MouseButton.Left;
        }
    }
}

export enum MouseButton {
    Left,
    Middle,
    Right
}

export interface TextFile {
    name: string;
    contents: string;
}