import { useEffect } from "react";
import { useMap } from "@mapcomponents/react-maplibre";
import type { LayersConfig, TilesSource } from "../config/layers";
import BuildingTilesLayer from "./ThreeDTilesLayer";
import TexturedMeshTilesLayer from "./TexturedMeshTilesLayer";
import PointCloudTilesLayer from "./PointCloudTilesLayer";

export type LayerStatus = { state: "loading" | "loaded" | "error"; message?: string };
export type LayerStatusHandler = (source: TilesSource, state: LayerStatus["state"], message?: string) => void;
export const sourceKey = (source: TilesSource) => JSON.stringify([source.id, source.type, source.url]);

function ConfiguredLayer({ source, onStatus }: { source: TilesSource; onStatus: LayerStatusHandler }) {
  useEffect(() => onStatus(source, "loading"), [source.id, source.type, source.url, onStatus]);
  switch (source.type) {
    case "LOD2": return <BuildingTilesLayer source={source} onStatus={onStatus} />;
    case "textured-mesh": return <TexturedMeshTilesLayer source={source} onStatus={onStatus} />;
    case "pointcloud": return <PointCloudTilesLayer source={source} onStatus={onStatus} />;
  }
}

export default function ConfiguredTilesLayers({ config, onStatus }: {
  config: LayersConfig;
  onStatus: LayerStatusHandler;
}) {
  const { map } = useMap({ mapId: "bonn-map" });
  const hasBuildings = config.layers.some((source) => source.visible && source.url && source.type !== "pointcloud");

  useEffect(() => {
    if (!map) return;
    let previous: unknown;
    let applied = false;
    const update = () => {
      if (!hasBuildings || applied || !map.getLayer("building-3d")) return;
      previous = map.getLayoutProperty("building-3d", "visibility");
      map.setLayoutProperty("building-3d", "visibility", "none");
      applied = true;
    };
    update();
    map.on("styledata", update);
    return () => {
      map.off("styledata", update);
      if (applied && map.getLayer("building-3d")) {
        map.setLayoutProperty("building-3d", "visibility", previous ?? "visible");
      }
    };
  }, [map, hasBuildings]);

  return <>{config.layers.filter((source) => source.visible && source.url).map((source) => (
    <ConfiguredLayer key={sourceKey(source)} source={source} onStatus={onStatus} />
  ))}</>;
}