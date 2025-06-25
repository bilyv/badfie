
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Custom plugin to handle health check endpoint
const healthCheckPlugin = () => {
  return {
    name: 'health-check',
    configureServer(server) {
      server.middlewares.use('/health', (req, res, next) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          const healthData = {
            status: 'OK',
            service: 'DigitalStock Frontend',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            port: 8080,
            framework: 'React + Vite',
            uptime: process.uptime(),
          };

          res.end(JSON.stringify(healthData, null, 2));
        } else {
          next();
        }
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [
    react(),
    healthCheckPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
