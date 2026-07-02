/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google AdSense client id, e.g. ca-pub-XXXXXXXX. Optional. */
  readonly VITE_ADSENSE_CLIENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
