export interface ISseMessage {
  shopCode: string;
  type: 'ORDER' | 'SHOP' | 'MENU' | 'TABLE' | 'PICKUP';
  data: {
    [key: string]: number;
  } | null;
}
