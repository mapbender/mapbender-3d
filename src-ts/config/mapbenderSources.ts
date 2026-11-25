import { isRecord } from "./layers";

type ParsedColor = { color: unknown; alpha: unknown };

function parseColor(value: unknown, alpha: unknown): ParsedColor {
  if (typeof value !== "string") return { color: value, alpha: alpha ?? 1 };

  const rgba = value.match(/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*((?:\d+(?:\.\d*)?|\.\d+)%?)\s*\)$/i);
  if (rgba) {
    const alphaText = rgba[4];
    const parsedAlpha = Number.parseFloat(alphaText) / (alphaText.endsWith("%") ? 100 : 1);
    return { color: rgba.slice(1, 4).map(Number), alpha: parsedAlpha };
  }

  const rgb = value.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (rgb) return { color: rgb.slice(1).map(Number), alpha: alpha ?? 1 };

  const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (!hex) return { color: value, alpha: alpha ?? 1 };
  const digits = hex[1].length === 3
    ? [...hex[1]].map((digit) => digit + digit).join("")
    : hex[1];
  return {
    color: [0, 2, 4].map((index) => Number.parseInt(digits.slice(index, index + 2), 16)),
    alpha: alpha ?? 1,
  };
}

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
