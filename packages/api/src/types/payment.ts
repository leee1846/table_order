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
