import { registerPlugin, type Plugin } from '@capacitor/core';

/**
 * 결제 이벤트 데이터 타입
 */
export interface IPaymentEventData {
  EVENT_MSG: string;
  [key: string]: unknown;
}

/**
 * 결제 승인 요청 옵션
 */
export interface IPaymentApproveOptions {
  /** 결제 금액 (필수) */
  amount: string | number;
  /** 할부 개월 (00:일시불, 02~24: 2~24개월, 36/48/60: 해당 개월) */
  installment?: string;
}

/**
 * 결제 취소 요청 옵션
 */
export interface IPaymentCancelOptions {
  /** 취소 금액 (필수) */
  amount: string | number;
  /** 원승인번호 (필수) */
  orgApprNum: string;
  /** 원승인일자 YYMMDD 형식 (필수) */
  orgApprDate: string;
}

/**
 * 결제 요청 파라미터 (네이티브로 전달되는 형식)
 */
interface IPaymentRequestParams {
  tran_type: 'D1' | 'D4';
  amount: string;
  tax?: string;
  installment: string;
  tran_no: string;
  approval_num?: string;
  approval_date?: string;
}

/**
 * 결제 응답 데이터
 */
export interface IPaymentResponse {
  TRAN_NO: string;
  TRAN_TYPE: string;
  CARD_NUM: string;
  CARD_NAME: string;
  ISSUER_CODE: string;
  TOTAL_AMOUNT: string;
  TAX: string;
  TIP: string;
  INSTALLMENT: string;
  RESULT_CODE: string;
  RESULT_MSG: string;
  APPROVAL_NUM: string;
  APPROVAL_DATE: string;
  ACQUIRER_CODE: string;
  ACQUIRER_NAME: string;
  MERCHANT_NUM: string;
  SHOP_TID: string;
  SHOP_BIZ_NUM: string;
  SHOP_NAME: string;
  VERSION: string;
}

/**
 * 네이티브 Payment 플러그인 인터페이스
 */
interface IPaymentPlugin extends Plugin {
  /**
   * 결제 요청 (네이티브 메서드)
   */
  requestPayment(params: IPaymentRequestParams): Promise<IPaymentResponse>;
  /**
   * 이벤트 리스너 추가
   */
  addListener(
    eventName: string,
    callback: (data: IPaymentEventData) => void
  ): Promise<{ remove: () => Promise<void> }>;
  /**
   * 결제 중단 (네이티브 메서드)
   */
  stopPayment(): Promise<void>;
}

const NativePayment = registerPlugin<IPaymentPlugin>('Payment');

/**
 * Payment
 * 네이티브 결제 플러그인 래퍼
 */
export interface IPayment {
  /**
   * [이벤트 리스너] 결제 진행 상태 모니터링
   * - 'paymentEvent' 이벤트를 통해 "카드를 넣어주세요", "처리중" 등의 메시지가 옴
   * @param eventName - 이벤트 이름 (예: 'paymentEvent')
   * @param callback - 이벤트 콜백 함수
   * @returns 리스너 제거 함수를 포함한 Promise
   */
  addListener(
    eventName: string,
    callback: (data: IPaymentEventData) => void
  ): Promise<{ remove: () => Promise<void> }>;

  /**
   * [승인 요청] 신용카드 결제 (D1)
   * @param options - 결제 옵션
   * @param options.amount - 결제 금액 (필수)
   * @param options.installment - 할부 개월 (00:일시불, 기본값: "00")
   * @param options.tax - 부가세 (옵션 없으면 10% 자동 계산)
   * @returns 결제 성공 데이터
   */
  approve(options: IPaymentApproveOptions): Promise<IPaymentResponse>;

  /**
   * [취소 요청] 신용카드 취소 (D4)
   * @param options - 취소 옵션
   * @param options.amount - 취소 금액 (필수)
   * @param options.orgApprNum - 원승인번호 (필수)
   * @param options.orgApprDate - 원승인일자 YYMMDD 형식 (필수)
   * @returns 취소 성공 데이터
   */
  cancel(options: IPaymentCancelOptions): Promise<IPaymentResponse>;

  /**
   * [결제 중단] 진행 중인 결제 프로세스 강제 종료 (STOP)
   * - 사용자가 모달에서 '취소' 또는 '닫기' 버튼을 눌렀을 때 호출
   * - 진행 중인 결제 요청을 취소하고, 리더기를 초기화 상태로 되돌림
   * @returns Promise<void>
   */
  stop(): Promise<void>;
}

export const Payment: IPayment = {
  addListener: async (eventName, callback) => {
    return NativePayment.addListener(eventName, callback);
  },

  approve: async (options) => {
    const amt = options.amount.toString();

    return NativePayment.requestPayment({
      // 부가세 자동 계산 (옵션 없으면 10% 자동)
      tran_type: 'D1',
      amount: amt,
      installment: options.installment || '00',
      tran_no: Date.now().toString(),
    });
  },

  cancel: async (options) => {
    return NativePayment.requestPayment({
      tran_type: 'D4',
      amount: options.amount.toString(),
      approval_num: options.orgApprNum,
      approval_date: options.orgApprDate,
      installment: '00', // 취소는 항상 일시불 처리
      tran_no: Date.now().toString(),
    });
  },

  stop: async () => {
    return NativePayment.stopPayment();
  },
};
