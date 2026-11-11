import { useEffect, useState } from "react";
import { Alert, Box, Checkbox, FormControlLabel, IconButton, MenuItem, Paper, Slider, TextField, Tooltip, Typography } from "@mui/material";
import LayersOutlined from "@mui/icons-material/LayersOutlined";
import Add from "@mui/icons-material/Add";
import DeleteOutline from "@mui/icons-material/DeleteOutlined";
import { initialLayersConfig } from "../config/layers";
import type { LayersConfig, RGBColor, TilesSource } from "../config/layers";
import { sourceKey } from "./ConfiguredTilesLayers";
import type { LayerStatus } from "./ConfiguredTilesLayers";

type Props = {
  config: LayersConfig;
  onChange: (config: LayersConfig) => boolean;
  error: string | null;
  statuses: Record<string, LayerStatus>;
};

const colorHex = (color: RGBColor) => `#${color.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
const hexColor = (value: string): RGBColor => [
  Number.parseInt(value.slice(1, 3), 16),
  Number.parseInt(value.slice(3, 5), 16),
  Number.parseInt(value.slice(5, 7), 16),
];

function UrlField({ url, onChange }: { url: string; onChange: (url: string) => void }) {
  const [draft, setDraft] = useState(url);
  useEffect(() => setDraft(url), [url]);
  return <TextField label="Tileset URL" size="small" fullWidth value={draft}
    onChange={(event) => { setDraft(event.target.value); onChange(event.target.value); }} />;
}

function LayerSettings({ source, onChange }: { source: TilesSource; onChange: (source: TilesSource) => void }) {
  return <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", minWidth: 0, gap: 2, pt: 1.5, pb: 1 }}>
    <TextField label="Name" size="small" value={source.name}
      onChange={(event) => onChange({ ...source, name: event.target.value })} />
    <TextField select label="Type" size="small" value={source.type} onChange={(event) => {
      const template = initialLayersConfig.layers.find((layer) => layer.type === event.target.value)!;
      onChange({ ...template, id: source.id, name: source.name, url: source.url, visible: source.visible, opacity: source.opacity });
    }}>
      <MenuItem value="LOD2">LOD2 Buildings</MenuItem>
      <MenuItem value="textured-mesh">Textured Mesh</MenuItem>
      <MenuItem value="pointcloud">Point Cloud</MenuItem>
    </TextField>
    <UrlField url={source.url} onChange={(url) => onChange({ ...source, url })} />
    <Box>
      <Typography variant="caption">Opacity {Math.round(source.opacity * 100)}%</Typography>
      <Slider aria-label={`${source.name} opacity`} size="small" min={0} max={1} step={0.05}
        value={source.opacity} onChange={(_event, value) => onChange({ ...source, opacity: value as number })} />
    </Box>
    {source.type === "pointcloud" && <TextField label="Point Size" type="number" size="small"
      slotProps={{ htmlInput: { min: 0.1, step: 0.5 } }} value={source.pointSize}
      onChange={(event) => onChange({ ...source, pointSize: Number(event.target.value) })} />}
    {source.type === "LOD2" && <>
      <TextField label="Surface Property" size="small" value={source.style.surfaceProperty}
        onChange={(event) => onChange({ ...source, style: { ...source.style, surfaceProperty: event.target.value } })} />
      <TextField label="Building ID Property" size="small" value={source.style.buildingIdProperty}
        onChange={(event) => onChange({ ...source, style: { ...source.style, buildingIdProperty: event.target.value } })} />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {([['roofColor', 'Roof'], ['wallColor', 'Walls'], ['selectionColor', 'Selection']] as const).map(([property, label]) => (
          <Box component="label" key={property} sx={{ display: "grid", gap: 0.5, fontSize: 12 }}>
            {label}
            <input aria-label={`${source.name} ${label} color`} type="color" value={colorHex(source.style[property])}
              onChange={(event) => onChange({ ...source, style: { ...source.style, [property]: hexColor(event.target.value) } })}
              style={{ width: 44, height: 30, padding: 2, cursor: "pointer" }} />
          </Box>
        ))}
      </Box>
    </>}
  </Box>;
}

export default function LayerTree({ config, onChange, error, statuses }: Props) {
  return <Paper component="section" aria-label="3D Layers" variant="outlined" sx={{
    position: "absolute", top: 12, right: 12, zIndex: 110,
    width: 330, maxWidth: "calc(100vw - 24px)", maxHeight: "calc(100dvh - 320px)",
    overflowY: "auto", overflowX: "hidden", borderRadius: 1, boxShadow: 3,
  }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 1, borderBottom: 1, borderColor: "divider" }}>
      <LayersOutlined fontSize="small" />
      <Typography component="h2" variant="subtitle2" sx={{ flex: 1 }}>3D Layers</Typography>
      <Tooltip title="Add Layer"><IconButton size="small" aria-label="Add Layer" onClick={() => {
        const template = initialLayersConfig.layers[1];
        onChange({ layers: [...config.layers, { ...template, id: crypto.randomUUID(), name: "New Layer", url: "", visible: false }] });
      }}><Add fontSize="small" /></IconButton></Tooltip>
    </Box>
    {error && <Alert severity="error" sx={{ m: 1 }}>{error}</Alert>}
    {config.layers.length === 0 && <Typography sx={{ p: 2 }} color="text.secondary">No layers</Typography>}
    {config.layers.map((source) => {
      const status = statuses[sourceKey(source)];
      const state = !source.url ? "URL missing" : !source.visible ? "Hidden" : status?.state ?? "loading";
      return <Box key={source.id} sx={{ px: 1.5, py: 1, borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControlLabel sx={{ m: 0, flex: 1, minWidth: 0, overflowWrap: "anywhere", '& .MuiFormControlLabel-label': { minWidth: 0 } }}
            control={<Checkbox size="small" checked={source.visible} disabled={!source.url}
              onChange={(_event, visible) => onChange({ layers: config.layers.map((layer) => layer.id === source.id ? { ...layer, visible } : layer) })} />}
            label={<Typography variant="body2">{source.name}</Typography>} />
          <Tooltip title="Remove Layer"><IconButton size="small" aria-label={`Remove ${source.name}`}
            onClick={() => onChange({ layers: config.layers.filter((layer) => layer.id !== source.id) })}>
            <DeleteOutline fontSize="small" />
          </IconButton></Tooltip>
        </Box>
        <Typography variant="caption" color={state === "error" ? "error" : "text.secondary"} sx={{ display: "block", pl: 4 }}>
          {source.type} · {state}
        </Typography>
        {source.visible && status?.message && <Alert severity="error" sx={{ mt: 1 }}>{status.message}</Alert>}
        <Box component="details" sx={{ mt: 1, minWidth: 0, '& summary': { cursor: "pointer", fontSize: 12, py: 0.5, overflowWrap: "anywhere" } }}>
          <summary>{source.name} settings</summary>
          <LayerSettings source={source} onChange={(updated) => onChange({ layers: config.layers.map((layer) => layer.id === source.id ? updated : layer) })} />
        </Box>
      </Box>;
    })}
  </Paper>;
}