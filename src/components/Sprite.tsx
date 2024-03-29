import { useRef, useEffect } from "react";
import { Textures } from "../model/Textures";

interface Props {
    width: number;
    height: number;
    textureName: string;
    spriteIndex: number;
}

export function Sprite(props: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (canvasRef.current) {
            const cx = canvasRef.current.getContext('2d');
            const texture = Textures.getTexture(props.textureName);
            texture.drawSprite(cx, props.spriteIndex, { x: 0, y: 0, width: props.width, height: props.height });
        }
    });
    return (
        <div style={{ width: `${props.width}px`, height: `${props.height}px` }}>
            <canvas ref={canvasRef} width={props.width} height={props.height} />
        </div>
    );
}