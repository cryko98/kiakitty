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

// Augment NodeJS namespace to add API_KEY to ProcessEnv.
// We do not declare 'process' here to avoid conflict with existing global declarations (e.g. from @types/node).
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