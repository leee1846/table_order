/**
 * 문자열에서 숫자만 추출합니다.
 *
 * @param value - 필터링할 문자열
 * @returns 숫자만 포함된 문자열
 *
 * @example
 * ```ts
 * extractNumbers('12:30') // '1230'
 * extractNumbers('abc123') // '123'
 * extractNumbers('hello') // ''
 * ```
 */
export const extractNumbers = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * 시간 값을 검증하고 유효한 범위로 제한합니다.
 * 0-23 범위를 초과하면 23으로 제한합니다.
 *
 * @param value - 검증할 시간 문자열
 * @returns 유효한 시간 문자열 (0-23)
 *
 * @example
 * ```ts
 * validateHour('12') // '12'
 * validateHour('25') // '23'
 * validateHour('8') // '8'
 * ```
 */
export const validateHour = (value: string): string => {
  const num = parseInt(value);
  return num > 23 ? '23' : value;
};

/**
 * 분 값을 검증하고 유효한 범위로 제한합니다.
 * 0-59 범위를 초과하면 59로 제한합니다.
 *
 * @param value - 검증할 분 문자열
 * @returns 유효한 분 문자열 (0-59)
 *
 * @example
 * ```ts
 * validateMinute('30') // '30'
 * validateMinute('65') // '59'
 * validateMinute('5') // '5'
 * ```
 */
export const validateMinute = (value: string): string => {
  const num = parseInt(value);
  return num > 59 ? '59' : value;
};

/**
 * 현재 시간을 Unix timestamp (초 단위)로 반환한다
 * 테스트를 위해 Date 객체를 주입할 수 있습니다.
 *
 * @param now - 현재 시간 (기본값: new Date())
 * @returns Unix timestamp (초 단위)
 *
 * @example
 * ```ts
 * getCurrentUnixTime() // 1700000000
 * getCurrentUnixTime(new Date('2025-01-15')) // 1736899200
 * ```
 */
export const getCurrentUnixTime = (now: Date = new Date()): number => {
  return Math.floor(now.getTime() / 1000);
};
