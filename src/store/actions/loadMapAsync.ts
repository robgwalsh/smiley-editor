import { createAsyncThunk } from "@reduxjs/toolkit";
import { convertMapFileToState, convertLegacyFileToState } from "../../model/map/converters";
import { MapData, setMapData } from "../../model/map/MapData";
import { MapFile } from "../../model/map/MapFile";
import { MapState } from "../../model/map/MapState";
import { Textures } from "../../model/Textures";
import { TextFile } from "../../utils/HtmlUtils";

export const loadMapAsync = createAsyncThunk(
    'loadMap',
    async (file: TextFile, thunkApi) => {

        let map: MapState;
        let data: MapData;
        try {
            const mapFile: MapFile = JSON.parse(file.contents);
            [map, data] = convertMapFileToState(mapFile);
        } catch (e) {
            // Maybe its a legacy file
            try {
                [map, data] = convertLegacyFileToState(file.contents);
            } catch (e2) {
                alert(`can't load the map :( ${e.message}`); // show the actual original error
                return;
            }
        }

        // TODO: if any required layers are missing, we could be nice and populate them.

        const error: string | null = validate(map, data);
        if (error) {
            alert(`invalid map file: ${error}`);
            return; // TODO:
        }

        // Update singletons that dont make sense to put in the store
        await loadTextures(map);
        setMapData(data);

        return map;
    });

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