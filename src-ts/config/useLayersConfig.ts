import { useCallback, useState } from "react";
import { initialLayersConfig, parseLayersConfig } from "./layers";

export default function useLayersConfig() {
  const [config, setConfig] = useState(initialLayersConfig);
  const [error, setError] = useState<string | null>(null);
  const replaceConfig = useCallback((value: unknown) => {
    try {
      setConfig(parseLayersConfig(value));
      setError(null);
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
      return false;
    }
  }, []);

  return { config, replaceConfig, error };
}
