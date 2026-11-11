import defaults from "./layers.json";

export type RGBColor = [number, number, number];

type BaseSource = {
  id: string;
  name: string;
  url: string;
  visible: boolean;
  opacity: number;
};

export type BuildingSource = BaseSource & {
  type: "LOD2";
  style: {
    surfaceProperty: string;
    buildingIdProperty: string;
    roofColor: RGBColor;
    wallColor: RGBColor;
    selectionColor: RGBColor;
  };
};

export type TexturedMeshSource = BaseSource & { type: "textured-mesh" };
export type PointCloudSource = BaseSource & { type: "pointcloud"; pointSize: number };
export type TilesSource = BuildingSource | TexturedMeshSource | PointCloudSource;
export type LayersConfig = { layers: TilesSource[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isColor(value: unknown): value is RGBColor {
  return Array.isArray(value) && value.length === 3 &&
    value.every((channel) => Number.isInteger(channel) && channel >= 0 && channel <= 255);
}

export function parseLayersConfig(value: unknown): LayersConfig {
  if (!isRecord(value) || !Array.isArray(value.layers)) {
    throw new Error("Configuration must contain a layers array.");
  }
  const ids = new Set<string>();
  for (const source of value.layers) {
    if (!isRecord(source) || typeof source.id !== "string" || !source.id.trim() ||
      typeof source.name !== "string" || !source.name.trim() || typeof source.url !== "string" ||
      typeof source.visible !== "boolean" || typeof source.opacity !== "number" ||
      !Number.isFinite(source.opacity) || source.opacity < 0 || source.opacity > 1) {
      throw new Error("Each layer needs an ID, name, URL, visibility, and opacity between 0 and 1.");
    }
    if (ids.has(source.id)) throw new Error(`Duplicate layer ID: ${source.id}`);
    ids.add(source.id);
    if (source.url) {
      let url: URL;
      try { url = new URL(source.url); }
      catch { throw new Error(`${source.name}: enter an absolute HTTP(S) URL.`); }
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error(`${source.name}: only HTTP(S) URLs are supported.`);
      }
    } else if (source.visible) {
      throw new Error(`${source.name}: a visible layer needs a URL.`);
    }
    switch (source.type) {
      case "LOD2": {
        const style = source.style;
        if (!isRecord(style) || typeof style.surfaceProperty !== "string" || !style.surfaceProperty.trim() ||
          typeof style.buildingIdProperty !== "string" || !style.buildingIdProperty.trim() ||
          !isColor(style.roofColor) || !isColor(style.wallColor) || !isColor(style.selectionColor)) {
          throw new Error(`${source.name}: invalid building style.`);
        }
        break;
      }
      case "pointcloud":
        if (typeof source.pointSize !== "number" || !Number.isFinite(source.pointSize) || source.pointSize <= 0) {
          throw new Error(`${source.name}: point size must be positive.`);
        }
        break;
      case "textured-mesh":
        break;
      default:
        throw new Error(`${source.name}: unsupported layer type.`);
    }
  }
  return structuredClone(value) as LayersConfig;
}

export const initialLayersConfig = parseLayersConfig(defaults);