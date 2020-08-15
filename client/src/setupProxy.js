const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000', // server 주소 등록
      changeOrigin: true,
    })
  );
};

// CORS 정책 해결 위해 proxy 사용
// https://create-react-app.dev/docs/proxying-api-requests-in-development/
