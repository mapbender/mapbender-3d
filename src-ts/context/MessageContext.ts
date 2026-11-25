import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import {
  InboundMessageType,
  InboundPayloads,
  MESSAGE_CHANNEL,
  MESSAGE_TYPES,
  OutboundMessageType,
  OutboundPayloads,
  STICKY_TYPES,
  isBridgeMessage,
} from "./messageProtocol";

type MessageHandler<K extends InboundMessageType> = (payload: InboundPayloads[K]) => void;

type MessageContextValue = {
  subscribe: <K extends InboundMessageType>(type: K, handler: MessageHandler<K>) => () => void;
  post: <K extends OutboundMessageType>(type: K, payload: OutboundPayloads[K]) => void;
};

const MessageContext = createContext<MessageContextValue | null>(null);

export function MessageProvider({ children }: { children: ReactNode }) {
  const subscribers = useRef(new Map<string, Set<(payload: unknown) => void>>());
  const latestMessages = useRef(new Map<string, unknown>());
  const readySent = useRef(false);

  const post = useCallback(<K extends OutboundMessageType>(
    type: K,
    payload: OutboundPayloads[K],
  ) => {
    window.parent.postMessage({ channel: MESSAGE_CHANNEL, type, payload }, window.location.origin);
  }, []);

  const subscribe = useCallback(<K extends InboundMessageType>(
    type: K,
    handler: MessageHandler<K>,
  ) => {
    const listeners = subscribers.current.get(type) ?? new Set<(payload: unknown) => void>();
    const listener = (payload: unknown) => handler(payload as InboundPayloads[K]);
    listeners.add(listener);
    subscribers.current.set(type, listeners);

    if (STICKY_TYPES.includes(type) && latestMessages.current.has(type)) {
      listener(latestMessages.current.get(type));
    }

    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) subscribers.current.delete(type);
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (!isBridgeMessage(event.data)) return;
      const message = event.data;

      if (STICKY_TYPES.includes(message.type)) {
        latestMessages.current.set(message.type, message.payload);
      }

      subscribers.current.get(message.type)?.forEach((handler) => handler(message.payload));
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (readySent.current) return;
    readySent.current = true;
    post(MESSAGE_TYPES.READY, {});
  }, [post]);

  const value = useMemo(() => ({ subscribe, post }), [subscribe, post]);
  return createElement(MessageContext.Provider, { value }, children);
}

function useMessageContext() {
  const context = useContext(MessageContext);
  if (!context) throw new Error("Message hooks must be used within MessageProvider.");
  return context;
}

export function useMessage<K extends InboundMessageType>(type: K, handler: MessageHandler<K>) {
  const { subscribe } = useMessageContext();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(
    () => subscribe(type, (payload) => handlerRef.current(payload)),
    [subscribe, type],
  );
}

export function usePostMessage() {
  return useMessageContext().post;
}