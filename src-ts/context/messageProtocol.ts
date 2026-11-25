export const MESSAGE_CHANNEL = "mb-3dview";

export const MESSAGE_TYPES = {
  INIT_VIEW: "initView",
  REQUEST_VIEW: "requestView",
  READY: "ready",
  VIEW_CHANGED: "viewChanged",
  UPDATE_LAYERTREE: "updateLayerTree",
  EXIT_3D: "exit3d",
  UPDATE_FEATUREINFO_STATE: "updateFeatureInfoState",
  FEATURE_INFO: "featureInfo",
} as const;

export type ViewPayload = {
  center: [number, number];
  zoom?: number;
  bearing?: number;
  pitch?: number;
};

export type MapbenderSourcePayload = {
  id: string | number;
  name: string;
  type: "3dtiles" | "wms" | "vector_tiles";
  variant?: "lod2" | "textured_mesh" | "pointcloud";
  url: string;
  opacity: number;
  style?: {
    surfaceProperty: string;
    buildingIdProperty: string;
    roofColor: string;
    wallColor: string;
    selectionColor: string;
  };
  pointSize?: number;
};

export type FeatureInfoStatePayload = boolean;
export type Wgs84Coordinate = [longitude: number, latitude: number];

export type InboundPayloads = {
  [MESSAGE_TYPES.INIT_VIEW]: ViewPayload;
  [MESSAGE_TYPES.REQUEST_VIEW]: Record<string, never>;
  [MESSAGE_TYPES.UPDATE_LAYERTREE]: MapbenderSourcePayload[];
  [MESSAGE_TYPES.UPDATE_FEATUREINFO_STATE]: FeatureInfoStatePayload;
};

export interface FeatureInfoPayload{
  click: Wgs84Coordinate
    info: {
        layer_id: string | number;
        properties: Record<string, any>;
    }
}

export type OutboundPayloads = {
  [MESSAGE_TYPES.READY]: Record<string, never>;
  [MESSAGE_TYPES.VIEW_CHANGED]: ViewPayload;
  [MESSAGE_TYPES.EXIT_3D]: ViewPayload | null;
  [MESSAGE_TYPES.FEATURE_INFO]: FeatureInfoPayload;
};

export type InboundMessageType = keyof InboundPayloads;
export type OutboundMessageType = keyof OutboundPayloads;
export type MessageType = InboundMessageType | OutboundMessageType;

export type BridgeMessage = {
  channel: typeof MESSAGE_CHANNEL;
  type: MessageType;
  payload?: unknown;
};

export const REPLAYABLE_MESSAGE_TYPES: readonly MessageType[] = [
  MESSAGE_TYPES.INIT_VIEW,
  MESSAGE_TYPES.UPDATE_LAYERTREE,
];

const messageTypeValues = new Set<string>(Object.values(MESSAGE_TYPES));

export function isBridgeMessage(value: unknown): value is BridgeMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return message.channel === MESSAGE_CHANNEL && typeof message.type === "string" &&
    messageTypeValues.has(message.type);
}
