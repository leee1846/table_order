import type { TFunction } from 'i18next';
import {
  KICC_PAYMENT_PLUGIN_ERROR_CODE_CANCELED,
  KICC_PAYMENT_PLUGIN_ERROR_MESSAGE_USER_CANCEL,
  KICC_PAYMENT_RESULT_MESSAGE_BY_CODE,
  type TKiccPaymentResultMessageCode,
} from '@/constants/kiccPaymentResultCode';

interface IKiccPaymentPluginErrorData {
  RESULT_CODE?: string;
  RESULT_MSG?: string;
  EVENT_MSG?: string;
}

/**
 * KICC 단말기 reject 형태는 환경(Capacitor 버전·네이티브 구현)에 따라 달라
 * RESULT_CODE / RESULT_MSG 가 아래 위치 중 어디에든 실릴 수 있다.
 * - error.data 하위 (RESULT_CODE / RESULT_MSG / EVENT_MSG)
 * - error 최상위 (RESULT_CODE / RESULT_MSG / EVENT_MSG)
 * - Capacitor 표준 reject (code / message)
 */
interface IKiccPaymentPluginError extends IKiccPaymentPluginErrorData {
  message?: string;
  code?: string;
  data?: IKiccPaymentPluginErrorData;
}

const parseKiccPaymentPluginError = (error: unknown): IKiccPaymentPluginError =>
  (error ?? {}) as IKiccPaymentPluginError;

const getKiccPaymentResultCode = (error: unknown): string | undefined => {
  const pluginError = parseKiccPaymentPluginError(error);
  const errorData = pluginError.data;

  return errorData?.RESULT_CODE ?? pluginError.RESULT_CODE ?? pluginError.code;
};

const isKiccPaymentPluginError = (error: unknown): boolean => {
  const pluginError = parseKiccPaymentPluginError(error);
  const errorData = pluginError.data;

  return Boolean(
    errorData?.RESULT_CODE ||
    errorData?.RESULT_MSG ||
    errorData?.EVENT_MSG ||
    pluginError.RESULT_CODE ||
    pluginError.RESULT_MSG ||
    pluginError.EVENT_MSG ||
    pluginError.code
  );
};

/** Capacitor reject 또는 KICC RESULT_CODE 9999 — 사용자 취소 */
export const isKiccPaymentUserCancelError = (error: unknown): boolean => {
  const pluginError = parseKiccPaymentPluginError(error);

  if (
    pluginError.message === KICC_PAYMENT_PLUGIN_ERROR_MESSAGE_USER_CANCEL &&
    pluginError.code === KICC_PAYMENT_PLUGIN_ERROR_CODE_CANCELED
  ) {
    return true;
  }

  return getKiccPaymentResultCode(error) === '9999';
};

const getKiccPaymentResultMessageByCode = (
  resultCode: string
): string | undefined => {
  if (!(resultCode in KICC_PAYMENT_RESULT_MESSAGE_BY_CODE)) {
    return undefined;
  }

  return KICC_PAYMENT_RESULT_MESSAGE_BY_CODE[
    resultCode as TKiccPaymentResultMessageCode
  ];
};

/**
 * 결제 오류 dialog 메시지
 * - KICC 플러그인 reject: constant 한국어 메시지를 i18n 키로 번역 (기존 flat key 방식)
 * - API·서버 Error: message 그대로 (constant 미적용)
 */
export const getKiccPaymentErrorDialogMessage = (
  error: unknown,
  fallbackMessage: string,
  t: TFunction
): string => {
  if (!isKiccPaymentPluginError(error)) {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return fallbackMessage;
  }

  const resultCode = getKiccPaymentResultCode(error);
  if (resultCode) {
    const messageByCode = getKiccPaymentResultMessageByCode(resultCode);
    if (messageByCode) {
      return `(${resultCode}) ${t(messageByCode)}`;
    }
  }

  return fallbackMessage;
};
