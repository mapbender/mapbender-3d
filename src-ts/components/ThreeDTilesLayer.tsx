import { useCallback, useRef, useState } from "react";
import { Enhanced3DTilePickingInfo } from "../lib/Tiles3DLayer2";
import Ml3DTileLayer from "../lib/Ml3DTilesLayer";
import type { Tile3D } from "@loaders.gl/tiles";
import type { Color } from "@deck.gl/core";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import type { BuildingSource } from "../config/layers";
import type { LayerStatusHandler } from "./ConfiguredTilesLayers";

type Props = { source: BuildingSource; onStatus: LayerStatusHandler };

export default function BuildingTilesLayer({ source, onStatus }: Props) {

  const [colorVersion, setColorVersion] = useState(0);
  const selectedRef = useRef<string | null>(null);
  const [selectedProps, setSelectedProps] = useState<Record<
    string,
    unknown
  > | null>(null);

  const getFeatureColor = useCallback(
    (featureId: number, tile: Tile3D): Color => {
      const props = tile.content?.propertyTable?.[featureId];
      const gmlId = props?.[source.style.buildingIdProperty];
      const surface = String(props?.[source.style.surfaceProperty] ?? "").toLowerCase();

      if (selectedRef.current && String(gmlId) === selectedRef.current) {
        return source.style.selectionColor;
      }
      if (surface === "roof") {
        return source.style.roofColor;
      }
      return source.style.wallColor;
    },
    [source.style],
  );

  const onClick = useCallback((info: unknown) => {
    const pickInfo = info as Enhanced3DTilePickingInfo;
    if (!pickInfo.picked) return;

    const rawId = pickInfo.featureProperties?.[source.style.buildingIdProperty];
    if (rawId !== undefined && rawId !== null) {
      const gmlId = String(rawId);
      const isDeselect = selectedRef.current === gmlId;
      selectedRef.current = isDeselect ? null : gmlId;
      setSelectedProps(
        isDeselect ? null : (pickInfo.featureProperties ?? null),
      );
      setColorVersion((v) => v + 1);
    }
  }, [source.style.buildingIdProperty]);

  return (
    <>
      <Ml3DTileLayer
        id={source.id}
        mapId="bonn-map"
        data={source.url}
        opacity={source.opacity}
        onError={(error) => { onStatus(source, "error", error.message); return true; }}
        pickable={true}
        getFeatureColor={getFeatureColor}
        onClick={onClick}
        updateTrigger={colorVersion}
        onTilesetLoad={() => onStatus(source, "loading")}
        onTileLoad={() => onStatus(source, "loaded")}
        onTileError={(_tile, message) => onStatus(source, "error", String(message))}
      />

      {selectedProps && source.opacity > 0 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 70,
            left: 12,
            zIndex: 100,
            width: "min(280px, calc(100vw - 24px))",
            maxHeight: "35vh",
            overflowY: "auto",
          }}
        >
          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            <Box sx={{ px: 2, py: 1.5, bgcolor: "primary.main" }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "primary.contrastText", fontWeight: 700 }}
              >
                Selected Building
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              {Object.entries(selectedProps).map(([key, value]) => (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mr: 2, flexShrink: 0 }}
                  >
                    {key}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ textAlign: "right", wordBreak: "break-all" }}
                  >
                    {String(value)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      )}
    </>
  );
}
