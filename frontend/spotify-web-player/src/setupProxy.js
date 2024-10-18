const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/auth/**', // All /auth/** requests will be proxied
    createProxyMiddleware({
      target: 'http://localhost:5000', // Proxy target (backend server)
      changeOrigin: true // Change the origin to the target URL
    })
  );
};
