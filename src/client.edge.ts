// @ts-ignore
import * as ReactClient from "../vendor/react-server-dom-webpack/client.edge";
import type { TemporaryReferenceSet } from "./types";

export const createTemporaryReferenceSet: (
  ...args: unknown[]
) => TemporaryReferenceSet = ReactClient.createTemporaryReferenceSet;

export function createServerReference(
  id: string
): (...args: unknown[]) => Promise<unknown> {
  return ReactClient.createServerReference(id);
}

export type EncodeFormActionCallback = <A>(
  id: any,
  args: Promise<A>
) => ReactCustomFormAction;

export type ReactCustomFormAction = {
  name?: string;
  action?: string;
  encType?: string;
  method?: string;
  target?: string;
  data?: null | FormData;
};

export interface Options {
  nonce?: string;
  encodeFormAction?: EncodeFormActionCallback;
  temporaryReferences?: TemporaryReferenceSet;
  replayConsoleLogs?: boolean;
  environmentName?: string;
  debugChannel?: { readable?: ReadableStream };
}

export function createFromFetch<T>(
  promiseForResponse: Promise<Response>,
  options: Options = {}
): Promise<T> {
  return ReactClient.createFromFetch(promiseForResponse, {
    serverConsumerManifest: {
      moduleMap: __rspack_rsc_manifest__.serverConsumerModuleMap,
      moduleLoading: __rspack_rsc_manifest__.moduleLoading,
      serverModuleMap: __rspack_rsc_manifest__.serverManifest,
    },
    ...options,
  });
}

export function createFromReadableStream<T>(
  stream: ReadableStream,
  options: Options = {}
): Promise<T> {
  return ReactClient.createFromReadableStream<T>(stream, {
    serverConsumerManifest: {
      moduleMap: __rspack_rsc_manifest__.serverConsumerModuleMap,
      moduleLoading: __rspack_rsc_manifest__.moduleLoading,
      serverModuleMap: __rspack_rsc_manifest__.serverManifest,
    },
    ...options,
  });
}

export const encodeReply: (
  value: unknown,
  options?: {
    temporaryReferences?: TemporaryReferenceSet;
    signal?: AbortSignal;
  }
) => Promise<string | FormData> = ReactClient.encodeReply;
