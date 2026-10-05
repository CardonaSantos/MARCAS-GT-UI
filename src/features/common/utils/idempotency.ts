import { useRef } from "react";

export function createIdempotencyKey(scope: string) {
  const cryptoApi = globalThis.crypto;
  const suffix =
    typeof cryptoApi?.randomUUID === "function"
      ? cryptoApi.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${scope}:${suffix}`;
}

export function useIdempotencyKey(scope: string) {
  const keyRef = useRef<string | null>(null);

  if (!keyRef.current) {
    keyRef.current = createIdempotencyKey(scope);
  }

  return keyRef.current;
}
