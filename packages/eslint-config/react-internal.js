import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import { config as baseConfig } from './base.js';

/**
 * React와 TypeScript를 사용하는 프로젝트를 위한 ESLint 설정
 * Turborepo의 모든 React 앱에서 공유하는 린팅 규칙
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: {
      react: {
        version: 'detect', // React 버전 자동 감지
      },
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,

      // JSX Transform 사용 시 import React 불필요
      'react/react-in-jsx-scope': 'off',

      // prop-types 검증 비활성화 (TypeScript 사용)
      'react/prop-types': 'off',

      // JSX에서 중괄호 내부 공백 일관성
      'react/jsx-curly-spacing': ['warn', { when: 'never', children: true }],

      // JSX Props에서 등호 주변 공백 제거
      'react/jsx-equals-spacing': ['warn', 'never'],

      // JSX 태그 닫기 괄호 위치
      'react/jsx-closing-bracket-location': ['warn', 'line-aligned'],

      // 불필요한 Fragment 사용 경고
      'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],

      // 배열 인덱스를 key로 사용하지 않기 (권장사항)
      'react/no-array-index-key': 'warn',

      // 안전하지 않은 target="_blank" 사용 방지
      'react/jsx-no-target-blank': ['error', { enforceDynamicLinks: 'always' }],

      // Self-closing 태그 사용 강제
      'react/self-closing-comp': ['warn', { component: true, html: true }],

      // 위험한 children prop과 JSX children 동시 사용 방지
      'react/no-children-prop': 'error',

      // 알려지지 않은 DOM 속성 사용 방지
      'react/no-unknown-property': 'error',

      // 안전하지 않은 lifecycle 메서드 사용 방지
      'react/no-unsafe': 'warn',

      // JSX에서 불필요한 중괄호 제거
      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never' },
      ],

      // ========================================
      // React Hooks 관련 규칙
      // ========================================

      // Hooks의 규칙 준수 (의존성 배열 체크)
      'react-hooks/rules-of-hooks': 'error',

      // Hooks 의존성 배열 완전성 체크
      'react-hooks/exhaustive-deps': 'warn',

      // ========================================
      // TypeScript 관련 규칙
      // ========================================

      // 사용하지 않는 변수 경고 (TypeScript)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // _로 시작하는 매개변수 무시
          varsIgnorePattern: '^_', // _로 시작하는 변수 무시
          caughtErrorsIgnorePattern: '^_', // _로 시작하는 에러 무시
        },
      ],

      // any 타입 사용 금지
      '@typescript-eslint/no-explicit-any': 'error',

      // 빈 함수 경고
      '@typescript-eslint/no-empty-function': 'warn',

      // 빈 인터페이스 경고
      '@typescript-eslint/no-empty-interface': 'warn',

      // require() 사용 경고 (ES6 import 권장)
      '@typescript-eslint/no-require-imports': 'warn',

      // 타입 단언 일관성
      '@typescript-eslint/consistent-type-assertions': [
        'warn',
        { assertionStyle: 'as', objectLiteralTypeAssertions: 'allow' },
      ],

      // ========================================
      // 일반 JavaScript 규칙
      // ========================================

      // console 사용 경고 (프로덕션에서 제거해야 함)
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // debugger 사용 금지
      'no-debugger': 'warn',

      // var 사용 금지 (let, const 사용)
      'no-var': 'error',

      // const 사용 권장
      'prefer-const': 'warn',

      // 화살표 함수 사용 권장
      'prefer-arrow-callback': 'warn',

      // 템플릿 리터럴 사용 권장
      'prefer-template': 'warn',

      // 객체 단축 구문 사용
      'object-shorthand': ['warn', 'always'],

      // 동등 비교 시 === 사용
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // 중괄호 스타일
      curly: ['warn', 'all'],

      // 중복된 import 방지
      'no-duplicate-imports': 'error',
    },
  },
  {
    // 특정 파일/폴더 무시
    ignores: [
      'dist/**',
      'build/**',
      'node_modules/**',
      '.turbo/**',
      'coverage/**',
      '*.config.js',
      '*.config.ts',
    ],
  },
];
