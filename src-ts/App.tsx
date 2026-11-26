import {
    MapLibreMap,
    MlNavigationTools,
    useMap,
} from "@mapcomponents/react-maplibre";
import { Button, Typography } from "@mui/material";
import ConfiguredTilesLayers from "./components/ConfiguredTilesLayers";
import useLayersConfig from "./config/useLayersConfig";
import Light from "./Light";
import useMapViewBridge from "./context/useMapViewBridge";
import useLayerTreeBridge from "./context/useLayerTreeBridge";
import useLayerErrorBridge from "./context/useLayerErrorBridge";

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
    const mapHook = useMap({ mapId: "3d-map"});
    const { config, replaceConfig, error } = useLayersConfig();
    const exit3d = useMapViewBridge(mapHook.map);
    useLayerTreeBridge(replaceConfig);
    const onStatus = useLayerErrorBridge(config, error);

    return (
        <>
            <div>
                <MapLibreMap
                    mapId="3d-map"
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
                    onClick={exit3d}
                >
                   <Typography variant="body2"> 2D</Typography>
                </Button>

            </div>
        </>
    );
};

export default App;
