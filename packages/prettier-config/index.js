/**
 * Prettier 공통 설정
 * Turborepo의 모든 앱에서 공유하는 코드 포맷팅 규칙
 */
module.exports = {
  // 들여쓰기 공백 수
  tabWidth: 2,
  // 탭 대신 스페이스 사용
  useTabs: false,
  // 세미콜론 항상 추가
  semi: true,
  // 작은따옴표 사용
  singleQuote: true,
  // 객체 속성의 따옴표: 필요할 때만 사용
  quoteProps: 'as-needed',
  // JSX에서 작은따옴표 대신 큰따옴표 사용
  jsxSingleQuote: false,
  // 후행 쉼표: ES5에서 유효한 곳에만 (객체, 배열 등)
  trailingComma: 'es5',
  // 객체 리터럴의 괄호 사이 공백
  bracketSpacing: true,
  // JSX 태그의 > 를 다음 줄로 내리지 않음
  bracketSameLine: false,
  // 화살표 함수 파라미터가 하나일 때도 괄호 사용
  arrowParens: 'always',
  // 한 줄의 최대 길이
  printWidth: 80,
  // 줄바꿈 문자: 자동 (OS에 따라)
  endOfLine: 'auto',
  // HTML 공백 민감도: CSS display 속성 기준
  htmlWhitespaceSensitivity: 'css',
};
