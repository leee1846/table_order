import '@emotion/react';
import type { Theme as UITheme } from '@repo/ui';

declare module '@emotion/react' {
  export interface Theme extends UITheme {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  }
}
