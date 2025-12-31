// @ts-expect-error
import * as ReactServer from '../vendor/react-server-dom-webpack/server.browser';
import type { RscManifest, ServerEntry, TemporaryReferenceSet } from './types';

export type { RscManifest, TemporaryReferenceSet } from './types';

export const rscManifest: RscManifest = __rspack_rsc_manifest__;

export function renderToReadableStream(
  model: unknown,
  options?: {
    debugChannel?: { readable?: ReadableStream; writable?: WritableStream };
    environmentName?: string | (() => string);
    filterStackFrame?: (
      url: string,
      functionName: string,
      lineNumber: number,
      columnNumber: number,
    ) => boolean;
    identifierPrefix?: string;
    signal?: AbortSignal;
    temporaryReferences?: TemporaryReferenceSet;
    onError?: (error: unknown) => void;
  },
) {
  ReactServer.renderToReadableStream(
    model,
    rscManifest.clientManifest,
    options,
  );
}

export function decodeReply<T>(
  body: string | FormData,
  options?: {
    temporaryReferences?: TemporaryReferenceSet;
  },
): Promise<T> {
  return ReactServer.decodeReply(body, rscManifest.serverManifest, options);
}

export function decodeAction<T>(body: FormData): Promise<() => T> | null {
  return ReactServer.decodeAction(body, rscManifest.serverManifest);
}

export function decodeFormState<S>(
  actionResult: S,
  body: FormData,
): Promise<unknown | null> {
  return ReactServer.decodeFormState(
    actionResult,
    body,
    rscManifest.serverManifest,
  );
}

export const registerServerReference: <T extends Function>(
  reference: T,
  id: string,
  exportName: null | string,
) => unknown = ReactServer.registerServerReference;

export const registerClientReference: (
  proxyImplementation: unknown,
  id: string,
  exportName: string,
) => unknown = ReactServer.registerClientReference;

export const createTemporaryReferenceSet: (
  ...args: unknown[]
) => TemporaryReferenceSet = ReactServer.createTemporaryReferenceSet;

export function loadServerAction(actionId: string): Function {
  const actionModId = rscManifest.serverManifest[actionId]?.id;

  if (!actionModId) {
    throw new Error(
      `Failed to find Server Action "${actionId}". This request might be from an older or newer deployment.`,
    );
  }

  const moduleExports = __webpack_require__(actionModId);
  const fn = moduleExports[actionId];
  if (typeof fn !== 'function') {
    throw new Error('Server actions must be functions');
  }
  return fn;
}

export type { ServerEntry } from './types';

export function createServerEntry<T>(
  value: T,
  resourceId: string,
): ServerEntry<T> {
  const entryJsFiles = rscManifest.entryJsFiles ?? [];
  const entryCssFiles = rscManifest.entryCssFiles?.[resourceId] ?? [];
  if (
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null)
  ) {
    Object.assign(value, {
      entryJsFiles,
      entryCssFiles,
    });
  }
  return value as ServerEntry<T>;
}
