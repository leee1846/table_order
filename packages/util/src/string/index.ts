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
 * 이미지 URL의 도메인을 127.0.0.1:5173에 맞춰서 변환합니다.
 * 전체 URL인 경우 도메인 부분을 교체하고, 상대 경로인 경우 127.0.0.1:5173을 앞에 붙입니다.
 *
 * @param imagePath - 변환할 이미지 경로 (전체 URL 또는 상대 경로)
 * @returns 127.0.0.1:5173에 맞춰 변환된 이미지 URL
 *
 * @example
 * ```ts
 * // 전체 URL인 경우
 * normalizeImageUrl('http://127.0.0.1:8080/shop/NEXA000001/menu/51/image.jpg')
 * // "http://127.0.0.1:5173/shop/NEXA000001/menu/51/image.jpg"
 *
 * // 상대 경로인 경우
 * normalizeImageUrl('/shop/NEXA000001/menu/51/image.jpg')
 * // "http://127.0.0.1:5173/shop/NEXA000001/menu/51/image.jpg"
 *
 * // null이나 빈 문자열인 경우
 * normalizeImageUrl(null) // null
 * normalizeImageUrl('') // ''
 * ```
 */

// TODO: 개발 서버 올라가면 없애기
export const normalizeImageUrl = (
  imagePath: string | null | undefined
): string | null => {
  if (!imagePath) {
    return imagePath ?? null;
  }

  const baseUrl = 'http://127.0.0.1:5173';

  // 전체 URL인 경우 (http:// 또는 https://로 시작)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    try {
      const url = new URL(imagePath);
      const pathname = url.pathname;
      return `${baseUrl}${pathname}`;
    } catch {
      // URL 파싱 실패 시 원본 반환
      return imagePath;
    }
  }

  // 상대 경로인 경우
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${path}`;
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
export const generateId = (): string => {
  return Date.now().toString();
};
