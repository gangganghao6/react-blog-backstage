import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
//@ts-ignore
import viteCompression from "vite-plugin-compression";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(),
        viteCompression({
            verbose: true,
            disable: false,
            threshold: 10240,
            algorithm: "gzip",
            ext: ".gz",
        })
    ],
    // 配置别名
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    //启动服务配置
    server: {
        host: "0.0.0.0",
        port: 8080,
        open: false,
        https: false,
        proxy: {
            "/api": {
                target: "http://localhost:3000", // 所要代理的目标地址
                rewrite: (path) => path.replace(/^\/api/, "/api"), // 重写传过来的path路径，比如 `/api/index/1?id=10&name=zs`（注意:path路径最前面有斜杠（/），因此，正则匹配的时候不要忘了是斜杠（/）开头的；选项的 key 也是斜杠（/）开头的）
                changeOrigin: true, // true/false, Default: false - changes the origin of the host header to the target URL
            },
        },
    },
    // 生产环境打包配置
    //去除 console debugger
    build: {
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
})
;
