export type TemporaryReferenceSet = Map<string, unknown>;

export type ServerEntry<T> = T & {
  entryJsFiles: string[];
  entryCssFiles: string[];
};

type ModuleLoading = {
  prefix: string;
  crossOrigin: 'use-credentials' | '';
};

type ServerConsumerModuleMap = {
  [id: string]: {
    [name: string]: { specifier: string; name: string };
  };
};

type ServerManifest = {
  [id: string]: ImportManifestEntry;
};

type ImportManifestEntry = {
  id: string;
  // chunks is a double indexed array of chunkId / chunkFilename pairs
  chunks: Array<string>;
  name: string;
  async?: boolean;
};

type ClientManifest = {
  [id: string]: ImportManifestEntry;
};

type RscManifest = {
  serverManifest: ServerManifest;
  clientManifest: ClientManifest;
  serverConsumerModuleMap: ServerConsumerModuleMap;
  moduleLoading: ModuleLoading;
  entryCssFiles: Record<string, string[]>;
  entryJsFiles: string[];
};

export interface BoundArgsEncryptionStrategy<T> {
  encrypt: (actionId: string, ...args: any[]) => Promise<T>;
  decrypt: (actionId: string, payloadPromise: Promise<T>) => Promise<any[]>;
}

declare global {
  const __webpack_require__: (id: string | number) => any;

  const __rspack_rsc_manifest__: RscManifest;

  const __rspack_rsc_hot_reloader__: {
    on: (callback: () => void) => () => void;
  };
}
