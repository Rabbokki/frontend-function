import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://dopaminex.kro.kr:8443', // 백엔드 URL
        changeOrigin: true,
        secure: true, // HTTPS 사용
        rewrite: (path) => path.replace(/^\/api/, '/api'), // // 방지
        logLevel: 'debug' // 프록시 로그 활성화
      }
    }
  }
});