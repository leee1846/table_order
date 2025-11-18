/**
 * Map에서 조건에 맞는 키들을 배열로 반환합니다.
 *
 * @param map - 검색할 Map
 * @param predicate - 조건 함수 (value, key를 받아 boolean 반환)
 * @returns 조건에 맞는 키들의 배열
 *
 * @example
 * ```ts
 * const map = new Map([
 *   [1, true],
 *   [2, false],
 *   [3, true]
 * ]);
 * getKeysWhere(map, (value) => value === true); // [1, 3]
 * ```
 */
export const getKeysWhere = <K, V>(
  map: Map<K, V>,
  predicate: (value: V, key: K) => boolean
): K[] => {
  return Array.from(map.entries())
    .filter(([key, value]) => predicate(value, key))
    .map(([key]) => key);
};

/**
 * Map에서 조건에 맞는 값들을 배열로 반환합니다.
 *
 * @param map - 검색할 Map
 * @param predicate - 조건 함수 (value, key를 받아 boolean 반환)
 * @returns 조건에 맞는 값들의 배열
 *
 * @example
 * ```ts
 * const map = new Map([
 *   [1, 'apple'],
 *   [2, 'banana'],
 *   [3, 'avocado']
 * ]);
 * getValuesWhere(map, (value) => value.startsWith('a')); // ['apple', 'avocado']
 * ```
 */
export const getValuesWhere = <K, V>(
  map: Map<K, V>,
  predicate: (value: V, key: K) => boolean
): V[] => {
  return Array.from(map.entries())
    .filter(([key, value]) => predicate(value, key))
    .map(([, value]) => value);
};
