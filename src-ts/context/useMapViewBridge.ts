import { useCallback, useEffect, useRef } from "react";
import { useMap } from "@mapcomponents/react-maplibre";
import { MESSAGE_TYPES, type ViewPayload } from "./messageProtocol";
import { useMessage, usePostMessage } from "./MessageContext";

export default function useMapViewBridge(map: ReturnType<typeof useMap>["map"]) {
  const post = usePostMessage();
  const lastPosition = useRef<ViewPayload | null>(null);

  const postViewChanged = useCallback(() => {
    if (!map) return;
    const center = map.getCenter();
    if (!center) return;

    const position: ViewPayload = {
      center: [center.lng, center.lat],
      zoom: map.getZoom(),
      bearing: map.getBearing(),
      pitch: map.getPitch(),
    };
    lastPosition.current = position;
    post(MESSAGE_TYPES.VIEW_CHANGED, position);
  }, [map, post]);

  useMessage(MESSAGE_TYPES.INIT_VIEW, (payload) => {
    if (!map || !Array.isArray(payload?.center) || payload.center.length !== 2) return;
    map.jumpTo({
      center: payload.center,
      zoom: typeof payload.zoom === "number" ? payload.zoom : map.getZoom(),
      bearing: typeof payload.bearing === "number" ? payload.bearing : map.getBearing(),
      pitch: typeof payload.pitch === "number" ? payload.pitch : map.getPitch(),
    });
  });

  useMessage(MESSAGE_TYPES.REQUEST_VIEW, postViewChanged);

  useEffect(() => {
    if (!map) return;
    map.on("moveend", postViewChanged);
    return () => {
      map.off("moveend", postViewChanged);
    };
  }, [map, postViewChanged]);

  return useCallback(() => {
    post(MESSAGE_TYPES.EXIT_3D, lastPosition.current);
  }, [post]);
}
