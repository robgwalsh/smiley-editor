import { useAppSelector } from "../hooks";
import { Sprite } from "./Sprite";

interface Props {
    button: string;
}

export function TilePalleteButton(props: Props) {

    const state = useAppSelector(state => state.editor);
    const selection = state.tileSelections[props.button];

    return (
        <div
            style={{
                width: "64px",
                position: "relative",
                height: "64px",
                border: "1px solid #232323"
            }}
        >
            <div style={{ position: "absolute", left: 0, top: 0 }}>
                {selection &&
                    <Sprite
                        width={64}
                        height={64}
                        spriteIndex={selection.tile}
                        textureName={state.map.header.textures.find(t=>t.id === selection.textureId).name}
                    />
                }
            </div>
            <div style={{ position: "absolute", left: 0, top: 0 }}>
                {props.button}
            </div>
        </div>
    )
}