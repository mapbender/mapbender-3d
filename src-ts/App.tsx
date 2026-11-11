// App.tsx oder App.jsx
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import {
    MapLibreMap,
    MlNavigationTools,
    useMap,
} from "@mapcomponents/react-maplibre";
import { Button, Typography } from "@mui/material";
import ConfiguredTilesLayers, { sourceKey } from "./components/ConfiguredTilesLayers";
import type { LayerStatus, LayerStatusHandler } from "./components/ConfiguredTilesLayers";
import LayerTree from "./components/LayerTree";
import useLayersConfig from "./config/useLayersConfig";
import Light from "./Light";

const MESSAGE_CHANNEL = "mb-3dview";
const MESSAGE_TYPES = {
    INIT_VIEW: "initView",
    REQUEST_VIEW: "requestView",
    READY: "ready",
    VIEW_CHANGED: "viewChanged",
    EXIT_3D: "exit3d",
} as const;

type ViewPayload = {
    center: [number, number];
    zoom?: number;
    bearing?: number;
    pitch?: number;
};

type BridgeMessage = {
    channel?: string;
    type?: string;
    payload?: ViewPayload;
};

type Position = {
    center: number[];
    zoom: number;
    bearing: number;
    pitch: number;
};

const primaryButtonStyle = {
    minWidth: "48px",
    backgroundColor: "#279ddc",
    borderColor: "#279ddc",
    color: "#fff",
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: 1.5,
    padding: "0.375rem 0.75rem",
    borderRadius: "0.375rem",
    textTransform: "none" as const,
    transition: "color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
    "&:hover": {
        backgroundColor: "#1A709E",
        borderColor: "#1A709E",
    },
    "&:active": {
        backgroundColor: "#1A709E",
        borderColor: "#1A709E",
    },
    "&:disabled": {
        backgroundColor: "#83c1eb",
        borderColor: "#83c1eb",
        opacity: 0.5,
    },
};

const App = () => {
    const mapHook = useMap({ mapId: "bonn-map" });
    const [lastPosition, setLastPosition] = useState<Position | null>(null);
    const { config, replaceConfig, error } = useLayersConfig();
    const [statuses, setStatuses] = useState<Record<string, LayerStatus>>({});
    const onStatus: LayerStatusHandler = useCallback((source, state, message) => {
        const key = sourceKey(source);
        setStatuses((previous) => previous[key]?.state === state && previous[key]?.message === message
            ? previous : { ...previous, [key]: { state, message } });
    }, []);

    const postViewChanged = useCallback(() => {
        if (!mapHook.map) return;
        const center = mapHook.map.getCenter();
        if (!center) return;
        const _lastPosition = {
            center: [center.lng, center.lat],
            zoom: mapHook.map.getZoom(),
            bearing: mapHook.map.getBearing(),
            pitch: mapHook.map.getPitch(),
        };
        window.parent.postMessage(
            {
                channel: MESSAGE_CHANNEL,
                type: MESSAGE_TYPES.VIEW_CHANGED,
                payload: _lastPosition,
            },
            window.location.origin,
        );
        setLastPosition(_lastPosition);
    }, [mapHook.map]);

    useEffect(() => {
        if (!mapHook.map) return;

        const applyView = (payload: ViewPayload | undefined) => {
            if (!payload || !Array.isArray(payload.center)) return;
            mapHook.map!.jumpTo({
                center: payload.center,
                zoom:
                    typeof payload.zoom === "number"
                        ? payload.zoom
                        : mapHook.map!.getZoom(),
                bearing:
                    typeof payload.bearing === "number"
                        ? payload.bearing
                        : mapHook.map!.getBearing(),
                pitch:
                    typeof payload.pitch === "number"
                        ? payload.pitch
                        : mapHook.map!.getPitch(),
            });
        };

        const handleMessage = (event: Event) => {
            const messageEvent = event as MessageEvent<unknown>;
            if (messageEvent.origin !== window.location.origin) return;
            if (messageEvent.source !== window.parent) return;
            const rawData = messageEvent.data;
            if (!rawData || typeof rawData !== "object") return;
            const data = rawData as BridgeMessage;
            if (data.channel !== MESSAGE_CHANNEL || !data.type) return;

            if (data.type === MESSAGE_TYPES.INIT_VIEW) {
                applyView(data.payload);
            }
            if (data.type === MESSAGE_TYPES.REQUEST_VIEW) {
                postViewChanged();
            }
        };

        const onMoveEnd = () => postViewChanged();

        window.addEventListener("message", handleMessage);
        mapHook.map.on("moveend", onMoveEnd);

        window.parent.postMessage(
            {
                channel: MESSAGE_CHANNEL,
                type: MESSAGE_TYPES.READY,
                payload: {},
            },
            window.location.origin,
        );

        return () => {
            window.removeEventListener("message", handleMessage);
            mapHook.map?.off("moveend", onMoveEnd);
        };
    }, [mapHook.map, postViewChanged]);

    // useEffect(()=>{

    //     if (!mapHook.map){
    //         return
    //     }
    //     mapHook.map.getLayer("building-3d")?.setLayoutProperty("visibility", "none")

    // }, [mapHook.map])

    return (
        <>
            <div>
                <MapLibreMap
                    mapId="bonn-map"
                    options={{
                        style: "https://wms.wheregroup.com/tileserver/style/osm-liberty.json",
                        center: [9.9843, 53.543328],
                        zoom: 16,
                        maxZoom: 22,
                        pitch: 65,
                        bearing: 20,
                        attributionControl: {
                            compact: false,
                        },
                    }}
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                />
                <ConfiguredTilesLayers config={config} onStatus={onStatus} />
                <LayerTree config={config} onChange={replaceConfig} error={error} statuses={statuses} />
                <Light />
                <MlNavigationTools
                    showZoomButtons
                    sx={{ marginBottom: "65px", right: "40px" }}
                ></MlNavigationTools>

                <Button
                    variant="contained"
                    size="small"
                    sx={{
                        ...primaryButtonStyle,
                        bottom: "70px",
                        zIndex: 100,
                        position: "absolute",
                        right: "40px",
                    }}
                    onClick={() => {
                        window.parent.postMessage(
                            {
                                channel: MESSAGE_CHANNEL,
                                type: MESSAGE_TYPES.EXIT_3D,

                                payload: lastPosition,
                            },
                            window.location.origin,
                        );
                    }}
                >
                   <Typography variant="body2"> 2D</Typography>
                </Button>

            </div>
        </>
    );
};

export default App;
