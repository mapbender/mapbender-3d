import { useEffect, useState } from "react";
import type { TilesSource } from "./layers";
import type { LayerStatusHandler } from "../components/ConfiguredTilesLayers";

type RootOptions = { core: { fetch: typeof fetch } };

export default function useTilesetRoot(source: TilesSource, onStatus: LayerStatusHandler) {
  const [options, setOptions] = useState<RootOptions | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    setOptions(null);
    onStatus(source, "loading");
    void fetch(source.url, { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error(`Tileset request failed: HTTP ${response.status}`);
      const json = await response.clone().json();
      if (!json?.root?.boundingVolume) throw new Error("Tileset root must define a boundingVolume.");
      if (controller.signal.aborted) return;
      setOptions({ core: { fetch: (input, init) => {
        const url = input instanceof Request ? input.url : String(input);
        return url === source.url ? Promise.resolve(response.clone()) : fetch(input, init);
      } } });
    }).catch((reason: unknown) => {
      if (!controller.signal.aborted) onStatus(source, "error", reason instanceof Error ? reason.message : String(reason));
    });
    return () => controller.abort();
  }, [source.id, source.type, source.url, onStatus]);
  return options;
}