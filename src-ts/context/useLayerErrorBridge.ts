import { useCallback, useEffect, useRef } from "react";
import type { LayersConfig } from "../config/layers";
import { sourceKey } from "../components/ConfiguredTilesLayers";
import type { LayerStatusHandler } from "../components/ConfiguredTilesLayers";
import { usePostMessage } from "./MessageContext";
import { MESSAGE_TYPES } from "./messageProtocol";
import type { LayerErrorPayload } from "./messageProtocol";

export default function useLayerErrorBridge(config: LayersConfig, error: string | null): LayerStatusHandler {
  const post = usePostMessage();
  const configurationError = useRef<string | null>(null);
  const reportedErrors = useRef(new Map<string, Set<string>>());
  const report = useCallback((payload: LayerErrorPayload) => {
    if (window.parent === window) {
      console.error(payload.layerName ? `3D (${payload.layerName}): ${payload.message}` : `3D: ${payload.message}`);
      return;
    }
    post(MESSAGE_TYPES.ERROR, payload);
  }, [post]);

  useEffect(() => {
    if (error === configurationError.current) return;
    configurationError.current = error;
    if (error) report({ message: `Layer configuration: ${error}` });
  }, [error, report]);

  useEffect(() => {
    const activeKeys = new Set(config.layers.filter((source) => source.visible && source.url).map(sourceKey));
    for (const key of reportedErrors.current.keys()) {
      if (!activeKeys.has(key)) reportedErrors.current.delete(key);
    }
  }, [config]);

  return useCallback((source, state, message) => {
    if (state !== "error") return;
    const normalizedMessage = message?.trim() || "Failed to load 3D tiles.";
    const key = sourceKey(source);
    const messages = reportedErrors.current.get(key) ?? new Set<string>();
    if (messages.has(normalizedMessage)) return;
    messages.add(normalizedMessage);
    reportedErrors.current.set(key, messages);
    report({ message: normalizedMessage, layerId: source.id, layerName: source.name });
  }, [report]);
}
