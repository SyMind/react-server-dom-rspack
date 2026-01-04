// @ts-expect-error
import * as ReactClient from '../vendor/react-server-dom-webpack/client.browser';
import type { TemporaryReferenceSet } from './types';

export type CallServerCallback = (
  id: string,
  args: unknown[],
) => Promise<unknown>;

let callServer: CallServerCallback | null = null;
export function setServerCallback(fn: CallServerCallback) {
  callServer = fn;
}

function callCurrentServerCallback(
  id: string,
  args: unknown[],
): Promise<unknown> {
  if (!callServer) {
    throw new Error(
      'No server callback has been registered. Call setServerCallback to register one.',
    );
  }
  return callServer(id, args);
}

function findSourceMapURL(
  filename: string,
  environmentName: string,
): string | null {
  const url = new URL('/__rspack_source_map', window.location.origin);
  url.searchParams.set('filename', filename);
  url.searchParams.set('environmentName', environmentName);
  return url.toString();
}

export function createServerReference(
  id: string,
): (...args: unknown[]) => Promise<unknown> {
  return ReactClient.createServerReference(
    id,
    callCurrentServerCallback,
    undefined,
    process.env.NODE_ENV === 'development' ? findSourceMapURL : undefined,
  );
}

export const registerServerReference: <T extends Function>(
  reference: T,
  id: string,
  exportName: string | null,
) => unknown = ReactClient.registerServerReference;

export const createTemporaryReferenceSet: (
  ...args: unknown[]
) => TemporaryReferenceSet = ReactClient.createTemporaryReferenceSet;

export type FindSourceMapURLCallback = (
  fileName: string,
  environmentName: string,
) => null | string;

export interface Options {
  environmentName?: string;
  replayConsoleLogs?: boolean;
  temporaryReferences?: TemporaryReferenceSet;
  debugChannel?: { readable?: ReadableStream; writable?: WritableStream };
}

export function createFromFetch<T>(
  promiseForResponse: Promise<Response>,
  options: Options = {},
): Promise<T> {
  return ReactClient.createFromFetch<T>(promiseForResponse, {
    ...options,
    callServer: callCurrentServerCallback,
  });
}

export function createFromReadableStream<T>(
  stream: ReadableStream,
  options: Options = {},
): Promise<T> {
  return ReactClient.createFromReadableStream<T>(stream, {
    ...options,
    callServer: callCurrentServerCallback,
  });
}

export const encodeReply: (
  value: unknown,
  options?: {
    temporaryReferences?: TemporaryReferenceSet;
    signal?: AbortSignal;
  },
) => Promise<string | FormData> = ReactClient.encodeReply;

export function onServerComponentChanges(callback: () => void): () => void {
  return __rspack_rsc_hot_reloader__.on(() => {
    callback();
  });
}
