export interface IPostPaymentRequest {
  orderGroupUuid: string;
  paymentType: 'CARD' | 'CASH';
  transactionAmount: number;
  transactionNumber?: string;
  approvalNumber?: string;
  cardNumber?: string;
  issuerCompany?: string;
  acquirerCompany?: string;
  installmentMonths?: string;
  transactionDate?: string;
}

export type TPaymentMethodCode = 'EASY';

export interface IPostPaymentApprovalRequestParams {
  paymentMethodCode: TPaymentMethodCode;
  orderGroupUuid: string;
  orderUuid: string;
}
