import { config } from '@repo/eslint-config/react-internal';

/**
 * @repo/eslint-config의 react-internal 설정을 사용
 */
export default [
  ...config,
  {
    // 프로젝트 특정 설정이 필요한 경우 추가
    files: ['src/**/*.{ts,tsx,js,jsx}'],
  },
];
