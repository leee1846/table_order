export interface ISseMessage {
  shopCode: string;
  type:
    | 'ORDER'
    | 'PAYMENT'
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
    | 'DEVICE_APP_UPDATE'
    | 'LOGOUT'
    | 'SHOP_THEME_PAGE'
    | 'SHOP_THEME_MENU'
    | 'PAYMENT';
  data:
    | {
        [key: string]: number | string;
      }
    | null
    | string[];
}
