export interface IPostSseHeartbeatAckParams {
  shopCode: string;
  androidId: string;
}

export interface IPostSseHeartbeatAckMutationVariables
  extends IPostSseHeartbeatAckParams {
  ignoreGlobalErrors?: number[];
}

export interface ISseMessage {
  shopCode: string;
  type:
    | 'PING'
    | 'ORDER'
    | 'SHOP'
    | 'MENU'
    | 'TABLE'
    | 'PICKUP'
    | 'DEVICE_THEFT'
    | 'DEVICE'
    | 'APP_OFF'
    | 'DEVICE_RESTART'
    | 'DEVICE_SCREEN_OFF'
    | 'DEVICE_SCREEN_ON'
    | 'DEVICE_APP_UPDATE'
    | 'LOGOUT'
    | 'SHOP_THEME_PAGE'
    | 'SHOP_THEME_MENU'
    | 'RING_BELL'
    | 'POS_ERROR'
    | 'ORDER_COMPLETE'
    | 'PING'
    | 'AGENT_PING'
    | 'POS_SYNC_START'
    | 'POS_SYNC_END';
  data:
    | {
        [key: string]: number | string;
      }
    | null
    | string[]
    | string;
}
