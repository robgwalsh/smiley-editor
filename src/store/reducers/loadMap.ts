import { Draft, PayloadAction } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../hooks";
import { EditorState } from "../../model/EditorState";
import { convertMapFileToState, convertLegacyFileToState } from "../../model/map/converters";
import { MapData, setMapData } from "../../model/map/MapData";
import { MapFile } from "../../model/map/MapFile";
import { MapState } from "../../model/map/MapState";
import { Textures } from "../../model/Textures";
import { TextFile } from "../../utils/HtmlUtils";
import { setIsMapLoading } from "./editor-slice";

export function loadMapImpl(state: Draft<EditorState>, action: PayloadAction<TextFile>) {
    let map: MapState;
    let data: MapData;
    try {
        const mapFile: MapFile = JSON.parse(action.payload.contents);
        [map, data] = convertMapFileToState(mapFile);
    } catch (e) {
        // Maybe its a legacy file
        try {
            [map, data] = convertLegacyFileToState(action.payload.contents);
        } catch (e2) {
            alert(`can't load the map :( ${e.message}`); // show the actual original error
            return;
        }
    }

    // TODO: if any required layers are missing, we could be nice and populate them.

    const error: string | null = validate(map, data);
    if (error) {
        alert(`invalid map file: ${error}`);
        return;
    }

    state.activeLayerName = map.visualLayers[0].name;
    state.map = map;
    state.isLoadingMap = true;

    // Update singletons that dont make sense to put in the store
    setMapData(data);
    loadTextures(map)
        .then(() => {
            // TODO: cant do this :(
            // need to figure out THUNK shit
            const dispatch = useAppDispatch();
            dispatch(setIsMapLoading(false));
        })
        .catch(error => alert(error))
}

async function loadTextures(map: MapState): Promise<void> {
    const promises = map.header.textures.map(t => Textures.initializeTextureAsync(t));
    for (const p of promises) {
        await p;
    }
}

function validate(map: MapState, data: MapData): string | null {
    if (map.visualLayers.length <= 0)
        throw new Error('there must be at least 1 visual layer');
    if (!map.enemyLayer)
        throw new Error("enemy layer missing");
    if (!map.idLayer)
        throw new Error("id layer missing");
    if (!map.variableLayer)
        throw new Error("variable layer missing");
    if (!map.enemyLayer)
        throw new Error("enemy layer missing");
    if (!map.walkLayer)
        throw new Error("walk layer missing");

    return null;
}