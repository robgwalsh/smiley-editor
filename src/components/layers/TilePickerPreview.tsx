import { Typography } from "@mui/material";
import { useAppSelector } from "../../hooks";
import { EditorState } from "../../model/EditorState";
import { StateUtils } from "../../utils/StateUtils";
import { Sprite } from "../Sprite";

export function TilePickerPreview() {

    const state: EditorState = useAppSelector(state => state.editor);

    if (!state.tilePickerGridPosition)
        return <></>

    return (
        <div style={{ display: "flex", alignItems: "top", height: "128px", gap: "10px" }}>
            <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
                press a number key or mouse button to assign this tile to it!
            </Typography>

            <Sprite
                width={64}
                height={64}
                spriteIndex={StateUtils.getSpritePickerMousedOverSpriteIndex(state)}
                textureName={state.selectedTextureName}
            />
            <Sprite
                width={128}
                height={128}
                spriteIndex={StateUtils.getSpritePickerMousedOverSpriteIndex(state)}
                textureName={state.selectedTextureName}
            />
        </div>
    );
}