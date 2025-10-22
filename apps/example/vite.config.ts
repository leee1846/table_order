import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
  },
});
