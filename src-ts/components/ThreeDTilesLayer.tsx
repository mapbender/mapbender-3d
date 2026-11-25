import { useCallback, useEffect, useRef, useState } from "react";
import { Enhanced3DTilePickingInfo } from "../lib/Tiles3DLayer2";
import Ml3DTileLayer from "../lib/Ml3DTilesLayer";
import type { Tile3D } from "@loaders.gl/tiles";
import type { Color } from "@deck.gl/core";
import { Box, Typography, Divider, Paper } from "@mui/material";
import { useMessage, usePostMessage } from "../context/MessageContext";
import { MESSAGE_TYPES } from "../context/messageProtocol";
import type { BuildingSource, RGBColor } from "../config/layers";
import type { LayerStatusHandler } from "./ConfiguredTilesLayers";

type Props = { source: BuildingSource; onStatus: LayerStatusHandler };

const deckColor = (color: RGBColor, alpha: number): Color => [
  color[0],
  color[1],
  color[2],
  Math.round(alpha * 255),
];

export default function BuildingTilesLayer({ source, onStatus }: Props) {

  const [colorVersion, setColorVersion] = useState(0);
  const [featureInfoActive, setFeatureInfoActive] = useState(false);
  const postMessage = usePostMessage();
  const selectedRef = useRef<string | null>(null);
  const [selectedProps, setSelectedProps] = useState<Record<
    string,
    unknown
  > | null>(null);

  useMessage(MESSAGE_TYPES.UPDATE_FEATUREINFO_STATE, setFeatureInfoActive);

  const getFeatureColor = useCallback(
    (featureId: number, tile: Tile3D): Color => {
      const props = tile.content?.propertyTable?.[featureId];
      const gmlId = props?.[source.style.buildingIdProperty];
      const surface = String(props?.[source.style.surfaceProperty] ?? "").toLowerCase();

      if (selectedRef.current && String(gmlId) === selectedRef.current) {
        return deckColor(source.style.selectionColor, source.style.selectionAlpha);
      }
      if (surface === "roof") {
        return deckColor(source.style.roofColor, source.style.roofAlpha);
      }
      return deckColor(source.style.wallColor, source.style.wallAlpha);
    },
    [source.style],
  );

  const onClick = useCallback((info: unknown) => {

    if (!featureInfoActive) return;


    const pickInfo = info as Enhanced3DTilePickingInfo;
    if (!pickInfo.picked) return;

    const coordinate = pickInfo.coordinate;
    if (coordinate && Number.isFinite(coordinate[0]) && Number.isFinite(coordinate[1])) {
      postMessage(MESSAGE_TYPES.FEATURE_INFO, {
        click: [coordinate[0], coordinate[1]],
        info: {
          layer_id: source.id,
          properties: pickInfo.featureProperties ?? {},
        },
      });
    }

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
  }, [source.id, source.style.buildingIdProperty, featureInfoActive, postMessage]);


  useEffect(() => {
    console.log("featureInfoActive:" , featureInfoActive)
  }, [featureInfoActive]);
  return (
    <>
      <Ml3DTileLayer
        id={source.id}
        mapId="3d-map"
        data={source.url}
        opacity={source.opacity}
        onError={(error) => { onStatus(source, "error", error.message); return true; }}
        pickable={featureInfoActive}
        getFeatureColor={getFeatureColor}
        onClick={ onClick }
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
