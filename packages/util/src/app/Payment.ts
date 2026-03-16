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
  /** 총 결제 금액 (필수) */
  amount: string | number;
  /** 부가세 금액 (필수). 미입력 시 총액의 10% 자동 계산 */
  tax?: string | number;
  /** 봉사료 금액 (필수). 미입력 시 "0" */
  tip?: string | number;
  /** 할부유무 (필수): "0" 일시불, "02"~"24" 등 N개월 */
  installment?: string;
  /** 단말기구분 (필수): '40' 일반거래. 미입력 시 '40' */
  terminalType?: '40' | 'TK' | 'RD' | 'BU' | 'VP' | 'MP' | 'HP';
}

/**
 * 가맹점 등록 정보 다운로드 옵션
 */
export interface IDownloadMerchantOptions {
  /** 사업자 번호 (10자리) */
  bizNo: string;
  /** 단말기 ID (8자리) */
  tid: string;
  /** 지역 번호 (예: 02) */
  zoneCode: string;
  /** 전화번호 */
  phone: string;
  /** "Y": 초기화 후 다운로드, "N": 갱신 (기본값: "N") */
  initYn?: 'Y' | 'N';
}

/**
 * 결제 요청 파라미터 (네이티브 전달 형식, 소문자)
 * - D1: 승인, D4: 당일/전일취소, RB: 직전거래통신취소(망취소)
 */
interface IPaymentRequestParams {
  /** tran_type 거래구분자 (ESSENTIAL) */
  tran_type: 'D1' | 'D4' | 'RB';
  /** terminal_type 단말기구분 (ESSENTIAL): '40' 일반거래 등 */
  terminal_type?: string;
  /** total_amount 총 결제 금액 (ESSENTIAL, 9 BYTE) */
  amount: string;
  /** tax 부가세 금액 (ESSENTIAL, 9 BYTE) */
  tax?: string;
  /** tip 봉사료 금액 (ESSENTIAL, 9 BYTE) */
  tip?: string;
  /** installment 할부유무 (ESSENTIAL): "0" 일시불, "N" N개월 */
  installment: string;
  /** tran_no 거래번호 (OPTIONAL). RB 취소 시 해당 거래 구분 */
  tran_no?: string;
  /** approval_num 승인번호 (OPTIONAL). D4 취소 시 필수 */
  approval_num?: string;
  /** approval_date 승인일자 (OPTIONAL). D4 취소 시 필수 */
  approval_date?: string;
  /** cancel 시 원거래 응답 전체 전달 */
  tran_serial_no?: string;
  card_num?: string;
  card_name?: string;
  issuer_code?: string;
  result_code?: string;
  result_msg?: string;
  acquirer_code?: string;
  acquirer_name?: string;
  ad1?: string;
  ad2?: string;
  merchant_num?: string;
  shop_tid?: string;
  shop_biz_num?: string;
  cashamount?: string;
  tpk?: string;
  shop_name?: string;
  version?: string;
}

/**
 * 결제 응답 데이터
 */
export interface IPaymentResponse {
  TRAN_SERIALNO: string;
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
  AD1: string;
  AD2: string;
  MERCHANT_NUM: string;
  SHOP_TID: string;
  SHOP_BIZ_NUM: string;
  CASHAMOUNT: string;
  TPK: string;
  SHOP_NAME: string;
  VERSION: string;
}

/**
 * 가맹점 다운로드 요청 파라미터 (네이티브로 전달되는 형식)
 */
interface IMerchantDownloadParams {
  biz_no: string;
  tid: string;
  zone_code: string;
  phone: string;
  init_yn: 'Y' | 'N';
}

/**
 * 네이티브 Payment 플러그인 인터페이스
 */
interface IPaymentPlugin extends Plugin {
  /**
   * 결제 요청 (네이티브 메서드)
   */
  requestPaymentActivity(
    params: IPaymentRequestParams
  ): Promise<IPaymentResponse>;
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
  /**
   * 가맹점 정보 다운로드 (네이티브 메서드)
   */
  requestMerchantDownload(params: IMerchantDownloadParams): Promise<unknown>;
  /**
   * 가맹점 정보 조회 (네이티브 메서드)
   */
  requestMerchantInquiry(): Promise<unknown>;
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
   * [취소 요청] 직전거래 통신취소 (RB) - approve() 반환값으로 취소
   * @param approvalResult - approve() 호출 시 반환된 결제 응답 (TRAN_NO로 거래 취소)
   * @returns 취소 성공 데이터
   */
  cancel(approvalResult: IPaymentResponse): Promise<IPaymentResponse>;

  /**
   * [결제 중단] 진행 중인 결제 프로세스 강제 종료 (STOP)
   * - 사용자가 모달에서 '취소' 또는 '닫기' 버튼을 눌렀을 때 호출
   * - 진행 중인 결제 요청을 취소하고, 리더기를 초기화 상태로 되돌림
   * @returns Promise<void>
   */
  stop(): Promise<void>;

  /**
   * [가맹점 등록] 정보 다운로드 (F3)
   * - KICC 서버로부터 가맹점 정보를 받아 단말기를 개통/갱신합니다.
   * @param options - 가맹점 등록 옵션
   * @param options.bizNo - 사업자 번호 (10자리)
   * @param options.tid - 단말기 ID (8자리)
   * @param options.zoneCode - 지역 번호 (예: 02)
   * @param options.phone - 전화번호
   * @param options.initYn - "Y": 초기화 후 다운로드, "N": 갱신 (기본값: "N")
   * @returns Promise<unknown>
   */
  downloadMerchant(options: IDownloadMerchantOptions): Promise<unknown>;

  /**
   * [가맹점 조회] 등록 정보 확인 (SL)
   * - 단말기가 정상적으로 등록되어 있는지 확인합니다.
   * @returns Promise<unknown>
   */
  inquiryMerchant(): Promise<unknown>;
}

export const Payment: IPayment = {
  addListener: async (eventName, callback) => {
    const result = await NativePayment.addListener(eventName, callback);
    return result;
  },

  approve: async (options) => {
    const amt = options.amount.toString();

    const result = await NativePayment.requestPaymentActivity({
      tran_type: 'D1',
      terminal_type: options.terminalType ?? '40',
      amount: amt,
      installment: options.installment ?? '00',
    });
    return result;
  },

  cancel: async (approvalResult) => {
    const result = await NativePayment.requestPaymentActivity({
      tran_type: 'RB',
      terminal_type: '40',
      amount: approvalResult.TOTAL_AMOUNT,
      installment: approvalResult.INSTALLMENT,
      tran_no: approvalResult.TRAN_NO,
    });
    return result;
  },

  stop: async () => {
    await NativePayment.stopPayment();
  },

  downloadMerchant: async (options) => {
    const result = await NativePayment.requestMerchantDownload({
      biz_no: options.bizNo,
      tid: options.tid,
      zone_code: options.zoneCode,
      phone: options.phone,
      init_yn: options.initYn || 'N',
    });
    return result;
  },

  inquiryMerchant: async () => {
    const result = await NativePayment.requestMerchantInquiry();
    return result;
  },
};
