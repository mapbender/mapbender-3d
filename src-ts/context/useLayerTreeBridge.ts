import { useMessage } from "./MessageContext";
import { MESSAGE_TYPES } from "./messageProtocol";
import mapMapbenderSources from "../config/mapbenderSources";

export default function useLayerTreeBridge(replaceConfig: (value: unknown) => boolean) {
  useMessage(MESSAGE_TYPES.UPDATE_LAYERTREE, (payload) => {
    replaceConfig(mapMapbenderSources(payload));
  });
}
