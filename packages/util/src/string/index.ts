/**
 * 문자열이 비어있는지 확인합니다.
 * null, undefined, 빈 문자열, 공백만 있는 문자열을 모두 empty로 판단합니다.
 *
 * @param str - 확인할 문자열 (null 또는 undefined 가능)
 * @returns 비어있으면 true, 아니면 false
 *
 * @example
 * ```ts
 * isEmpty('') // true
 * isEmpty('  ') // true
 * isEmpty(null) // true
 * isEmpty(undefined) // true
 * isEmpty('hello') // false
 * isEmpty(' hello ') // false
 * ```
 */
export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * 숫자를 원화 포맷으로 포맷팅합니다.
 *
 * @param num - 포맷팅할 숫자
 * @returns 원화 포맷이 적용된 문자열
 *
 * @example
 * ```ts
 * formatCurrency(1000) // "1,000"
 * formatCurrency(1000000) // "1,000,000"
 * formatCurrency(1234567) // "1,234,567"
 * formatCurrency(123) // "123"
 * formatCurrency(0) // "0"
 * ```
 */
export const formatCurrency = (num: number): string => {
  return num.toLocaleString('ko-KR');
};

/**
 * 숫자를 받아서 1의 자리일 경우 앞에 0을 붙여줍니다.
 *
 * @param num - 포맷팅할 숫자
 * @returns 1의 자리일 경우 앞에 0이 붙은 문자열, 아니면 원래 숫자의 문자열
 *
 * @example
 * ```ts
 * padZero(1) // "01"
 * padZero(5) // "05"
 * padZero(10) // "10"
 * padZero(25) // "25"
 * padZero(0) // "00"
 * ```
 */
export const padZero = (num: number): string => {
  return num.toString().padStart(2, '0');
};

/**
 * 이미지 파일의 고유한 ID를 생성합니다.
 * 타임스탬프를 기반으로 생성합니다.
 *
 *
 * @returns 타임스탬프 기반 고유 ID 문자열
 *
 * @example
 * ```ts
 * generateId() // "1234567890123"
 * ```
 */
const generateIdCounterRef = { value: 0 };
export const generateId = (): string => {
  // Avoid collisions when multiple IDs are created in the same millisecond.
  generateIdCounterRef.value = (generateIdCounterRef.value + 1) % 100000;
  const rand = Math.random().toString(36).slice(2, 8);
  return `${Date.now()}-${generateIdCounterRef.value}-${rand}`;
};

/**
 * 숫자 문자열에서 앞의 0을 제거합니다.
 * 빈 문자열이면 빈 문자열을 반환하고, 숫자로 변환 불가능한 경우 원래 문자열을 반환합니다.
 *
 * @param value - 처리할 숫자 문자열
 * @returns 앞의 0이 제거된 숫자 문자열
 *
 * @example
 * ```ts
 * normalizeNumberString('05') // "5"
 * normalizeNumberString('007') // "7"
 * normalizeNumberString('0') // "0"
 * normalizeNumberString('') // ""
 * normalizeNumberString('123') // "123"
 * ```
 */
export const normalizeNumberString = (value: string): string => {
  if (value === '') {
    return '';
  }
  const numValue = Number(value);
  if (!isNaN(numValue)) {
    return numValue.toString();
  }
  return value;
};

/**
 * 결제 수단 코드를 i18n 키로 변환합니다. (키는 한국어 문자열)
 *
 * @param method - 결제 수단 코드 (예: 'CARD', 'CASH', 'CANCELED_ALL')
 * @returns 한국어 키 문자열 (번역 파일에서 같은 키를 사용)
 */
export const formatPaymentMethodLabel = (method?: string | null): string => {
  if (!method) {
    return '-';
  }

  const normalized = method.toUpperCase();
  switch (normalized) {
    case 'CARD':
      return '카드';
    case 'CASH':
      return '현금';
    case 'CANCELED_ALL':
      return '전체 취소';
    default:
      return '기타';
  }
};
