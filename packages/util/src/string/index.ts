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
 * 문자열에서 숫자만 추출합니다.
 * 입력값에서 숫자가 아닌 문자를 모두 제거하여 반환합니다.
 *
 * @param value - 필터링할 문자열
 * @returns 숫자만 포함된 문자열
 *
 * @example
 * ```ts
 * allowOnlyNumbers('123-456-7890') // "1234567890"
 * allowOnlyNumbers('abc123def') // "123"
 * allowOnlyNumbers('123.45') // "12345"
 * allowOnlyNumbers('') // ""
 * ```
 */
export const allowOnlyNumbers = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

/**
 * 문자열이 숫자만 포함하는지 검증합니다.
 * 빈 문자열이거나 숫자만 포함된 경우 true를 반환합니다.
 *
 * @param value - 검증할 문자열
 * @returns 빈 문자열이거나 숫자만 포함하면 true, 아니면 false
 *
 * @example
 * ```ts
 * isOnlyNumbers('123') // true
 * isOnlyNumbers('') // true
 * isOnlyNumbers('abc') // false
 * isOnlyNumbers('123abc') // false
 * isOnlyNumbers('12.34') // false
 * isOnlyNumbers('+123') // false
 * ```
 */
export const isOnlyNumbers = (value: string): boolean => {
  return value === '' || /^[0-9]+$/.test(value);
};

/**
 * 숫자만 허용하고 최대값으로 제한한 값을 반환합니다.
 * 입력 문자열에서 숫자가 아닌 문자를 제거한 뒤, max를 초과하면 max로 clamping합니다.
 *
 * @param value - 사용자 입력 문자열
 * @param max - 허용 최대값 (이clusive)
 * @returns 0 이상 max 이하의 숫자
 *
 * @example
 * ```ts
 * clampNumericToMax('12345', 999) // 999
 * clampNumericToMax('500', 999) // 500
 * clampNumericToMax('1,000,000', 999999999) // 1000000
 * clampNumericToMax('abc', 100) // 0
 * ```
 */
export const clampNumericToMax = (value: string, max: number): number => {
  const numericStr = allowOnlyNumbers(value);
  if (numericStr.length === 0) {
    return 0;
  }
  const num = Number(numericStr);
  return Number.isNaN(num) ? 0 : Math.min(Math.max(0, num), max);
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
const generateIdCounterState = { value: 0 };

export const generateId = (): string => {
  generateIdCounterState.value = (generateIdCounterState.value + 1) % 100000;
  const rand = Math.random().toString(36).slice(2, 8);
  return `${Date.now()}-${generateIdCounterState.value}-${rand}`;
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
 * 이메일 형식이 유효한지 검증합니다.
 * 기본적인 이메일 형식 검증을 수행합니다 (로컬파트@도메인.최상위도메인).
 *
 * @param email - 검증할 이메일 주소
 * @returns 유효한 이메일 형식이면 true, 아니면 false
 *
 * @example
 * ```ts
 * isValidEmail('user@example.com') // true
 * isValidEmail('test.email@domain.co.kr') // true
 * isValidEmail('invalid.email') // false
 * isValidEmail('@example.com') // false
 * isValidEmail('user@') // false
 * ```
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || !email.trim()) {
    return false;
  }

  // 기본적인 이메일 형식 검증: 로컬파트@도메인.최상위도메인
  const emailRegex = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
  return emailRegex.test(email.trim());
};

/**
 * 한국 연락처 형식이 유효한지 검증합니다.
 * 숫자만 추출했을 때 9~11자리면 유효한 한국 연락처로 간주합니다.
 *
 * @param value - 검증할 연락처 문자열 (하이픈 등 포함 가능)
 * @returns 유효한 연락처 형식이면 true, 아니면 false
 *
 * @example
 * ```ts
 * isValidPhoneNumber('010-1234-5678') // true
 * isValidPhoneNumber('0212345678') // true
 * isValidPhoneNumber('123') // false
 * isValidPhoneNumber('01012345678901') // false
 * ```
 */
export const isValidPhoneNumber = (value: string): boolean => {
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.length >= 9 && digitsOnly.length <= 11;
};

/**
 * 새 비밀번호 유효성 검사 (조건: 최소 8자, 영문 대/소문자·숫자·특수문자 중 3종 이상, 공백 불가)
 * 실패 시 에러 메시지(한국어)를 반환하고, 성공 시 빈 문자열을 반환합니다.
 *
 * @param value - 검증할 비밀번호 문자열
 * @returns 에러 메시지 또는 빈 문자열
 */
export const validateNewPassword = (value: string): string => {
  if (!value) {
    return '새 비밀번호를 입력해주세요.';
  }
  if (/\s/.test(value)) {
    return '공백은 사용할 수 없습니다.';
  }
  if (value.length < 8) {
    return '비밀번호는 최소 8자 이상이어야 합니다. (권장: 10~12자)';
  }
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(value);
  const typeCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(
    Boolean
  ).length;
  if (typeCount < 3) {
    return '영문 대문자, 소문자, 숫자, 특수문자 중 3종 이상을 조합해주세요.';
  }
  return '';
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
    case 'PARTIAL':
      return '분할결제';
    default:
      return '기타';
  }
};
