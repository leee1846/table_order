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
