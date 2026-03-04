import type { InstallmentOption } from './types';
import {
  INSTALLMENT_LUMP_SUM,
  INSTALLMENT_MONTHS_STANDARD,
  INSTALLMENT_MONTHS_MIN,
  INSTALLMENT_MONTHS_MAX,
  INSTALLMENT_STRING_LUMP_SUM,
} from './constants';

/**
 * 할부 옵션 목록 생성
 * 일시불, 2~24개월, 36/48/60개월 옵션을 포함
 */
export const createInstallmentOptions = (
  translate: (key: string, params?: Record<string, string | number>) => string
): InstallmentOption[] => {
  const options: InstallmentOption[] = [
    { value: INSTALLMENT_LUMP_SUM, label: translate('일시불') },
  ];

  // 2~24개월 옵션 추가
  for (
    let month = INSTALLMENT_MONTHS_MIN;
    month <= INSTALLMENT_MONTHS_MAX;
    month++
  ) {
    options.push({
      value: month,
      label: translate('{{months}}개월', { months: month }),
    });
  }

  // 36, 48, 60개월 옵션 추가
  INSTALLMENT_MONTHS_STANDARD.forEach((month) => {
    options.push({
      value: month,
      label: translate('{{months}}개월', { months: month }),
    });
  });

  return options;
};

/**
 * 할부 개월 수를 결제 API 형식 문자열로 변환
 * @param months - 할부 개월 수 (0: 일시불, 2-24: 2~24개월, 36/48/60: 해당 개월)
 * @returns 결제 API 형식 문자열 ("00", "02"-"24", "36"/"48"/"60")
 */
export const formatInstallmentMonthsToString = (months: number): string => {
  if (months === INSTALLMENT_LUMP_SUM) {
    return INSTALLMENT_STRING_LUMP_SUM;
  }

  if (months >= INSTALLMENT_MONTHS_MIN && months <= INSTALLMENT_MONTHS_MAX) {
    return months.toString().padStart(2, '0');
  }

  if (INSTALLMENT_MONTHS_STANDARD.includes(months)) {
    return months.toString();
  }

  return INSTALLMENT_STRING_LUMP_SUM;
};
