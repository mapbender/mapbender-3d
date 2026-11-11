import { useCallback } from "react";
import { Ml3DTileLayer } from "@mapcomponents/deck-gl";
import type { TexturedMeshSource } from "../config/layers";
import type { LayerStatusHandler } from "./ConfiguredTilesLayers";
import useTilesetRoot from "../config/useTilesetRoot";

export default function TexturedMeshTilesLayer({ source, onStatus }: {
  source: TexturedMeshSource;
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
    loadOptions={loadOptions}
    onTileLoad={onTileLoad}
    onError={(error) => { onStatus(source, "error", error.message); return true; }}
    onTileError={(_tile, message) => onStatus(source, "error", String(message))}
  />;
}