import { isRecord } from "./layers";
import { parseColor } from "../utils/parseColor";

export default function mapMapbenderSources(payload: unknown): unknown {
  if (!Array.isArray(payload)) return payload;

  const layers: unknown[] = [];
  for (const candidate of payload) {
    if (!isRecord(candidate) || candidate.type !== "3dtiles") continue;

    const base = {
      id: typeof candidate.id === "string" || typeof candidate.id === "number"
        ? String(candidate.id)
        : candidate.id,
      name: candidate.name,
      url: candidate.url,
      opacity: candidate.opacity,
      visible: true,
    };

    if (candidate.variant === "lod2") {
      const style = isRecord(candidate.style) ? candidate.style : {};
      const roof = parseColor(style.roofColor, style.roofAlpha);
      const wall = parseColor(style.wallColor, style.wallAlpha);
      const selection = parseColor(style.selectionColor, style.selectionAlpha);
      layers.push({
        ...base,
        type: "LOD2",
        style: {
          surfaceProperty: style.surfaceProperty,
          buildingIdProperty: style.buildingIdProperty,
          roofColor: roof.color,
          roofAlpha: roof.alpha,
          wallColor: wall.color,
          wallAlpha: wall.alpha,
          selectionColor: selection.color,
          selectionAlpha: selection.alpha,
        },
      });
    } else if (candidate.variant === "textured_mesh") {
      layers.push({ ...base, type: "textured_mesh" });
    } else if (candidate.variant === "pointcloud") {
      layers.push({ ...base, type: "pointcloud", pointSize: candidate.pointSize });
    }
  }

  return { layers };
}
