import { useCallback, useEffect, useState } from "react";
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

  useEffect(() => {
    const channel = new BroadcastChannel("mb-3dview");
    const receive = (data: unknown) => {
      if (!data || typeof data !== "object") return;
      const message = data as { channel?: unknown; type?: unknown; payload?: unknown };
      if (message.channel === "mb-3dview" && message.type === "setConfig") replaceConfig(message.payload);
    };
    const receiveWindow = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === window.parent) receive(event.data);
    };
    channel.onmessage = (event) => receive(event.data);
    window.addEventListener("message", receiveWindow);
    return () => {
      channel.close();
      window.removeEventListener("message", receiveWindow);
    };
  }, [replaceConfig]);

  return { config, replaceConfig, error };
}