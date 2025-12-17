import { ServerConsumerModuleMap, ModuleLoading } from "react-server-dom-webpack/client.edge";
import type { ServerManifest } from "react-server-dom-webpack/server";
import type { ClientManifest } from "react-server-dom-webpack/server.edge";

declare global {
    const __webpack_require__: (id: string | number) => any;

    const __rspack_rsc_manifest__: {
        serverManifest: ServerManifest,
        clientManifest: ClientManifest,
        serverConsumerModuleMap: ServerConsumerModuleMap,
        moduleLoading: ModuleLoading,
        entryCssFiles: Record<string, string[]>,
        entryJsFiles: string[],
    }
}
