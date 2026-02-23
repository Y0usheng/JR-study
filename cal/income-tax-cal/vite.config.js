import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/JR-study/', // 这里必须填你的【仓库名】，前后都要有斜杠
  test: {
    environment: 'jsdom', // 单元测试环境配置
    globals: true,
  }
})