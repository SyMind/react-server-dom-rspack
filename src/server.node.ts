// @ts-expect-error
import * as ReactServer from '../vendor/react-server-dom-webpack/server.node';
import type { ServerEntry, TemporaryReferenceSet } from './types';

export type { TemporaryReferenceSet } from './types';

export function renderToReadableStream(
  model: any,
  options?: {
    temporaryReferences?: TemporaryReferenceSet;
    environmentName?: string | (() => string);
    filterStackFrame?: (
      url: string,
      functionName: string,
      lineNumber: number,
      columnNumber: number,
    ) => boolean;
    onError?: (error: unknown) => void;
    signal?: AbortSignal;
    debugChannel?: { readable?: ReadableStream; writable?: WritableStream };
  },
): ReadableStream<Uint8Array> {
  return ReactServer.renderToReadableStream(
    model,
    __rspack_rsc_manifest__.clientManifest,
    options,
  );
}

export function decodeReply<T>(
  body: string | FormData,
  options?: { temporaryReferences?: TemporaryReferenceSet },
): Promise<T[]> {
  return ReactServer.decodeReply(
    body,
    __rspack_rsc_manifest__.serverManifest,
    options,
  );
}

export function decodeReplyFromAsyncIterable<T>(
  iterable: AsyncIterable<[string, string | File]>,
  options?: {
    temporaryReferences?: TemporaryReferenceSet;
  },
): Promise<T> {
  return ReactServer.decodeReplyFromAsyncIterable(
    iterable,
    __rspack_rsc_manifest__.serverManifest,
    options,
  );
}

export function decodeAction(body: FormData): Promise<() => unknown> | null {
  return ReactServer.decodeAction(body, __rspack_rsc_manifest__.serverManifest);
}

export function decodeFormState(
  actionResult: unknown,
  body: FormData,
): Promise<unknown | null> {
  return ReactServer.decodeFormState(
    actionResult,
    body,
    __rspack_rsc_manifest__.serverManifest,
  );
}

export function registerServerReference<T extends Function>(
  reference: T,
  id: string,
  exportName: string | null,
): unknown {
  return ReactServer.registerServerReference(reference, id, exportName);
}

export function registerClientReference(
  proxyImplementation: any,
  id: string,
  exportName: string,
): unknown {
  return ReactServer.registerClientReference(
    proxyImplementation,
    id,
    exportName,
  );
}

export const createTemporaryReferenceSet: (
  ...args: unknown[]
) => TemporaryReferenceSet = ReactServer.createTemporaryReferenceSet;

export async function loadServerAction(actionId: string): Promise<Function> {
  const actionModId = __rspack_rsc_manifest__.serverManifest[actionId]?.id;

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
  const entryJsFiles = __rspack_rsc_manifest__.entryJsFiles ?? [];
  const entryCssFiles =
    __rspack_rsc_manifest__.entryCssFiles?.[resourceId] ?? [];
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
