import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')) as {
  version: string;
};

/** 빌드 결과물에 /version.json을 생성하는 플러그인 */
function generateVersionJson(version: string): Plugin {
  return {
    name: 'generate-version-json',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version }),
      });
    },
  };
}

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
    generateVersionJson(pkg.version),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    target: 'chrome83',
  },
  esbuild: {
    target: 'chrome83',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'chrome83',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
  },
  server: {
    port: 5173,
  },
});
