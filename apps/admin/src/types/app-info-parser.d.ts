declare module 'app-info-parser' {
  export interface ApkParser {
    versionName?: string;
    application?: {
      metaData?: Array<{ name: string; value: string }>;
    };
  }

  export interface IpaParser {
    versionName?: string;
    application?: {
      metaData?: Array<{ name: string; value: string }>;
    };
  }

  export default class AppInfoParser {
    constructor(file: File | Blob | string);
    parse(): Promise<ApkParser | IpaParser>;
  }
}
