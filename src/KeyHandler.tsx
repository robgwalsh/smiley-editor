import { useEffect, useLayoutEffect } from "react"
import { useAppDispatch, useAppSelector } from "./hooks";
import { assignMapTile, assignTilePickerTarget } from "./store/editor-slice";

export function KeyHandler() {

    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.editor);

    const handleKeyDown = (e: KeyboardEvent) => {
        const key = Number.parseInt(e.key);
        if (Number.isNaN(key))
            return;

        if (state.tilePickerGridPosition) {
            dispatch(assignTilePickerTarget(key.toString()));
        } else if (state.mapMousePosition) {
            dispatch(assignMapTile(key.toString()));
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    return <></>
}