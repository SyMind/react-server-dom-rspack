// @ts-ignore
import * as ReactClient from "react-server-dom-webpack/client.browser";
import type { TemporaryReferenceSet } from "./types";

export type CallServerCallback = (
  id: string,
  args: unknown[]
) => Promise<unknown>;

let callServer: CallServerCallback | null = null;
export function setServerCallback(fn: CallServerCallback) {
  callServer = fn;
}

function callCurrentServerCallback(id: string, args: any): Promise<any> {
  if (!callServer) {
    throw new Error(
      "No server callback has been registered. Call setServerCallback to register one."
    );
  }
  return callServer(id, args);
}

function findSourceMapURL(
  filename: string,
  environmentName: string
): string | null {
  const url = new URL("/__rspack_source_map", window.location.origin);
  url.searchParams.set("filename", filename);
  url.searchParams.set("environmentName", environmentName);
  return url.toString();
}

export function createServerReference(
  id: string
): (...args: unknown[]) => Promise<unknown> {
  return ReactClient.createServerReference(
    id,
    callCurrentServerCallback,
    undefined,
    process.env.NODE_ENV == "development" ? findSourceMapURL : undefined
  );
}

export const registerServerReference: (
  reference: any,
  id: string,
  exportName: string | null
) => unknown = ReactClient.registerServerReference;

export const createTemporaryReferenceSet: (
  ...args: unknown[]
) => TemporaryReferenceSet = ReactClient.createTemporaryReferenceSet;

export type FindSourceMapURLCallback = (
  fileName: string,
  environmentName: string
) => null | string;

export interface Options {
  environmentName?: string;
  replayConsoleLogs?: boolean;
  temporaryReferences?: TemporaryReferenceSet;
  debugChannel?: { readable?: ReadableStream; writable?: WritableStream };
}

export function createFromFetch<T>(
  promiseForResponse: Promise<Response>,
  options: Options = {}
): Promise<T> {
  return ReactClient.createFromFetch<T>(promiseForResponse, {
    callServer: callCurrentServerCallback,
    ...options,
  });
}

export function createFromReadableStream<T>(
  stream: ReadableStream,
  options: Options = {}
): Promise<T> {
  return ReactClient.createFromReadableStream<T>(stream, {
    callServer: callCurrentServerCallback,
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
