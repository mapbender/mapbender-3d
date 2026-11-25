import colorString from "color-string";

type ParsedColor = { color: unknown; alpha: unknown };

export function parseColor(value: unknown, alpha: unknown): ParsedColor {
  const fallback = { color: value, alpha: alpha ?? 1 };
  if (typeof value !== "string") return fallback;

  const text = value.trim().toLowerCase();
  const rgba = colorString.get.rgb(text);
  if (!rgba) return fallback;

  const hasEmbeddedAlpha = text.startsWith("rgba(")
    || text.includes("/")
    || text.split(",").length === 4
    || (text.startsWith("#") && (text.length === 5 || text.length === 9))
    || text === "transparent";

  return {
    color: rgba.slice(0, 3),
    alpha: hasEmbeddedAlpha ? rgba[3] : alpha ?? 1,
  };
}
