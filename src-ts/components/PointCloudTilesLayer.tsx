import { useCallback } from "react";
import { Ml3DTileLayer } from "@mapcomponents/deck-gl";
import type { PointCloudSource } from "../config/layers";
import type { LayerStatusHandler } from "./ConfiguredTilesLayers";
import useTilesetRoot from "../config/useTilesetRoot";

export default function PointCloudTilesLayer({ source, onStatus }: {
  source: PointCloudSource;
  onStatus: LayerStatusHandler;
}) {
  const onTileLoad = useCallback(() => onStatus(source, "loaded"), [onStatus, source.id, source.type, source.url]);
  const loadOptions = useTilesetRoot(source, onStatus);
  if (!loadOptions) return null;
  return <Ml3DTileLayer
    mapId="bonn-map"
    id={source.id}
    data={source.url}
    opacity={source.opacity}
    pointSize={source.pointSize}
    loadOptions={loadOptions}
    onTileLoad={onTileLoad}
    onError={(error) => { onStatus(source, "error", error.message); return true; }}
    onTileError={(_tile, message) => onStatus(source, "error", String(message))}
  />;
}