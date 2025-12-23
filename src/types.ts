export type TemporaryReferenceSet = Map<string, unknown>;

type ModuleLoading = {
    prefix: string,
    crossOrigin: 'use-credentials' | '',
}

type ServerConsumerModuleMap = {
    [id: string]: {
        [name: string]: {specifier: string, name: string},
    },
};

type ServerManifest = {
  [id: string]: ImportManifestEntry,
};

type ImportManifestEntry = {
  id: string,
  // chunks is a double indexed array of chunkId / chunkFilename pairs
  chunks: Array<string>,
  name: string,
  async?: boolean,
};

type ClientManifest = {
  [id: string]: ImportManifestEntry,
};

declare global {
    const __webpack_require__: ((id: string | number) => any) & {
        rscHmr: {
            on: (callback: () => void) => () => void;
        };
    };

    const __rspack_rsc_manifest__: {
        serverManifest: ServerManifest,
        clientManifest: ClientManifest,
        serverConsumerModuleMap: ServerConsumerModuleMap,
        moduleLoading: ModuleLoading,
        entryCssFiles: Record<string, string[]>,
        entryJsFiles: string[],
    }
}
