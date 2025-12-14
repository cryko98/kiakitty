declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.bmp' {
  const value: string;
  export default value;
}

declare module '*.tiff' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}

declare module '@google/genai';

// Augment the existing NodeJS namespace to include API_KEY in ProcessEnv.
// This avoids redeclaring 'process' which causes "Cannot redeclare block-scoped variable" error.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}

interface ImportMetaEnv {
  readonly [key: string]: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}