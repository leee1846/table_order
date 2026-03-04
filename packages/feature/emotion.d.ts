import '@emotion/react';
import type { Theme as UITheme } from '@repo/ui';

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends UITheme {}
}

