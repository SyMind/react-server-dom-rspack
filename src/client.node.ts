import type { Readable } from 'node:stream';
// @ts-expect-error
import * as ReactClient from '../vendor/react-server-dom-webpack/client.node';
import type { EncodeFormActionCallback } from './client.edge';

export * from './client.edge';

export type Options = {
  nonce?: string;
  encodeFormAction?: EncodeFormActionCallback;
  replayConsoleLogs?: boolean;
  environmentName?: string;
  // For the Node.js client we only support a single-direction debug channel.
  debugChannel?: Readable;
};

export function createFromNodeStream<T>(
  stream: Readable,
  options?: Options,
): Promise<T> {
  return ReactClient.createFromNodeStream(
    stream,
    {
      moduleMap: __rspack_rsc_manifest__.serverConsumerModuleMap,
      moduleLoading: __rspack_rsc_manifest__.moduleLoading,
      serverModuleMap: __rspack_rsc_manifest__.serverManifest,
    },
    options,
  );
}
