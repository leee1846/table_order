/**
 * 배열에서 최소값을 반환합니다.
 * 빈 배열인 경우 null을 반환합니다.
 *
 * @param arr - 숫자 배열
 * @returns 최소값 또는 null
 *
 * @example
 * ```ts
 * getMinFromArray([1, 2, 3, 4, 5]); // 1
 * getMinFromArray([10, -5, 0, 3]); // -5
 * getMinFromArray([]); // null
 * ```
 */
export const getMinFromArray = (arr: number[]): number | null => {
  if (arr.length === 0) {
    return null;
  }
  return Math.min(...arr);
};

/**
 * 배열에서 최대값을 반환합니다.
 * 빈 배열인 경우 null을 반환합니다.
 *
 * @param arr - 숫자 배열
 * @returns 최대값 또는 null
 *
 * @example
 * ```ts
 * getMaxFromArray([1, 2, 3, 4, 5]); // 5
 * getMaxFromArray([10, -5, 0, 3]); // 10
 * getMaxFromArray([]); // null
 * ```
 */
export const getMaxFromArray = (arr: number[]): number | null => {
  if (arr.length === 0) {
    return null;
  }
  return Math.max(...arr);
};
