// @ts-expect-error
import * as ReactServer from '../vendor/react-server-dom-webpack/server.browser';
import type {
  BoundArgsEncryptionStrategy,
  ServerEntry,
  TemporaryReferenceSet,
} from './types';

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
    __rspack_rsc_manifest__.clientManifest,
    options,
  );
}

export function decodeReply<T>(
  body: string | FormData,
  options?: {
    temporaryReferences?: TemporaryReferenceSet;
  },
): Promise<T> {
  return ReactServer.decodeReply(
    body,
    __rspack_rsc_manifest__.serverManifest,
    options,
  );
}

export function decodeAction<T>(body: FormData): Promise<() => T> | null {
  return ReactServer.decodeAction(body, __rspack_rsc_manifest__.serverManifest);
}

export function decodeFormState<S>(
  actionResult: S,
  body: FormData,
): Promise<unknown | null> {
  return ReactServer.decodeFormState(
    actionResult,
    body,
    __rspack_rsc_manifest__.serverManifest,
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

// This function ensures that all the exported values are valid server actions,
// during the runtime. By definition all actions are required to be async
// functions, but here we can only check that they are functions.
export function ensureServerActions(actions: any[]) {
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    if (typeof action !== 'function') {
      throw new Error(
        `A "use server" file can only export async functions, found ${typeof action}.`,
      );
    }
  }
}

const defaultStrategy: BoundArgsEncryptionStrategy<any> = {
  encrypt: async (_actionId: string, ...args: any[]) => args,
  decrypt: async (_actionId: string, payloadPromise: Promise<any>) =>
    payloadPromise,
};

let currentStrategy = defaultStrategy;

export function setServerActionBoundArgsEncryption<T>(
  strategy: BoundArgsEncryptionStrategy<T>,
) {
  currentStrategy = strategy;
}

export async function encryptActionBoundArgs(
  actionId: string,
  ...args: any[]
): Promise<any> {
  return currentStrategy.encrypt(actionId, ...args);
}

export async function decryptActionBoundArgs(
  actionId: string,
  encryptedPromise: Promise<any>,
): Promise<any> {
  return currentStrategy.decrypt(actionId, encryptedPromise);
}
