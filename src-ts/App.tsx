// App.tsx oder App.jsx
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import {
    MapLibreMap,
    MlNavigationTools,
    useMap,
    useMapState,
} from "@mapcomponents/react-maplibre";
import { Ml3DTileLayer } from "@mapcomponents/deck-gl";
import { Button, Typography } from "@mui/material";
import ThreeDTilesLayer from "./ThreeDTilesLayer";
import Light from "./Light";

const tilesMinZoom = 15;
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
    const [showTiles, setShowTiles] = useState(false);
    const mapHook = useMap({ mapId: "bonn-map" });
    const mapState = useMapState({ watch: { viewport: true } });
    const [lastPosition, setLastPosition] = useState<Position | null>(null);
    const [showMesh, setShowMesh] = useState(false);

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

    // listen to Zoom Level
    useEffect(() => {
        if (!mapHook.map) return;
        if (!mapState.viewport?.zoom) return;

        if (mapState.viewport?.zoom > tilesMinZoom && !showTiles) {
            setShowTiles(true);
        } else if (mapState.viewport?.zoom <= tilesMinZoom && showTiles) {
            setShowTiles(false);
        }
    }, [mapState.viewport, mapHook.map, showTiles]);

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
                        maxZoom: 19,
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
                {showMesh ? (
                    <Ml3DTileLayer
                        data="https://3dtiles.wheregroup.com/tileset.json"
                        id="mesh-layer"
                    />
                ) : (
                    <>
                    <ThreeDTilesLayer key="tiles3d" />
                    <Light />
                    </>
                )}
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

                <Button
                    variant="contained"
                    size="small"
                    sx={{
                        ...primaryButtonStyle,
                        top: "66px",
                        zIndex: 100,
                        position: "absolute",
                        right: "36px",
                    }}
                    onClick={() => setShowMesh(!showMesh)}
                >
                    {showMesh ? "3D-Modell zeigen" : "3D-Luftbild zeigen"}
                </Button>
            </div>
        </>
    );
};

export default App;
