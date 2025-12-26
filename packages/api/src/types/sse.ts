export interface ISseMessage {
  shopCode: string;
  type:
    | 'ORDER'
    | 'SHOP'
    | 'MENU'
    | 'TABLE'
    | 'PICKUP'
    | 'DEVICE_THEFT'
    | 'DEVICE'
    | 'DEVICE_OFF'
    | 'DEVICE_RESTART'
    | 'DEVICE_SCREEN_OFF'
    | 'DEVICE_SCREEN_ON'
    | 'DEVICE_APP_UPDATE';
  data:
    | {
        [key: string]: number | string;
      }
    | null
    | string[];
}
