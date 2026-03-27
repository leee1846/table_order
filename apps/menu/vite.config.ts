import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { readFileSync } from 'fs';

const pkg = JSON.parse(
  readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
) as {
  version: string;
};

// React Compiler 설정
// https://ko.react.dev/learn/react-compiler
const ReactCompilerConfig = {
  // 향후 필요 시 여기에 옵션 추가 가능
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    target: 'chrome130',
    // 별도 asset 파일 요청을 인터셉트하지 못하는 버그를 우회하기 위해
    // 로고 PNG (~23KB)를 포함한 소형 이미지들을 base64 data URL로 인라인 처리
    assetsInlineLimit: 25000,
  },
  esbuild: {
    target: 'chrome130',
  },
  optimizeDeps: {
    //노드 모듈에서 의존성도 변환 대상에 포함
    esbuildOptions: {
      target: 'chrome130',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
  },
  server: {
    port: 5174,
  },
});
