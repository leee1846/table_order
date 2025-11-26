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

/**
 * 4자리 시간 문자열을 "HH:MM" 형식으로 변환합니다.
 *
 * @param timeString - 4자리 시간 문자열 (예: "0900")
 * @param separator - 시와 분 사이의 구분자 (기본값: ":")
 * @param defaultValue - 유효하지 않은 값일 때 반환할 기본값 (기본값: "00:00")
 * @returns 포맷팅된 시간 문자열 (예: "09:00")
 *
 * @example
 * ```ts
 * formatTimeDisplay('0900') // '09:00'
 * formatTimeDisplay('1830', ' : ') // '18 : 30'
 * formatTimeDisplay('123') // '00:00'
 * formatTimeDisplay('123', ':', '00:00') // '00:00'
 * ```
 */
export const formatTimeDisplay = (
  timeString: string,
  separator: string = ':',
  defaultValue: string = '00:00'
): string => {
  if (!timeString || timeString.length !== 4) {
    return defaultValue;
  }
  const hour = timeString.substring(0, 2);
  const minute = timeString.substring(2, 4);
  return `${hour}${separator}${minute}`;
};

/**
 * 4자리 시간 문자열을 시/분으로 파싱합니다.
 *
 * @param timeString - 4자리 시간 문자열 (예: "0900")
 * @returns 시와 분을 포함한 객체 (예: { hour: "09", minute: "00" })
 *
 * @example
 * ```ts
 * parseTimeString('0900') // { hour: '09', minute: '00' }
 * parseTimeString('1830') // { hour: '18', minute: '30' }
 * parseTimeString('123') // { hour: '', minute: '' }
 * ```
 */
export const parseTimeString = (
  timeString: string
): {
  hour: string;
  minute: string;
} => {
  if (!timeString || timeString.length !== 4) {
    return { hour: '', minute: '' };
  }
  return {
    hour: timeString.substring(0, 2),
    minute: timeString.substring(2, 4),
  };
};

/**
 * 시와 분을 4자리 시간 문자열로 포맷팅합니다.
 *
 * @param hour - 시 (예: "9" 또는 "09")
 * @param minute - 분 (예: "0" 또는 "00")
 * @returns 4자리 시간 문자열 (예: "0900")
 *
 * @example
 * ```ts
 * formatTimeString('9', '0') // '0900'
 * formatTimeString('18', '30') // '1830'
 * formatTimeString('8', '5') // '0805'
 * ```
 */

export const formatTimeString = (hour: string, minute: string): string => {
  const formattedHour = hour.padStart(2, '0');
  const formattedMinute = minute.padStart(2, '0');
  return formattedHour + formattedMinute;
};
