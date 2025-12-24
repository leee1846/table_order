export interface ISseMessage {
  shopCode: string;
  type:
    | 'ORDER'
    | 'SHOP'
    | 'MENU'
    | 'TABLE'
    | 'PICKUP'
    | 'DEVICE_THEFT'
    | 'DEVICE';
  data: {
    [key: string]: number | string;
  } | null;
}
