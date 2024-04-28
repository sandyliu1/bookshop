const cds = require('@sap/cds');
const express = require('express');
cds.once('bootstrap', (app) => {
  const LOG = cds.log("customServer");
  // Adapting portal resources path in local (non-production) environment
  if (process.env.CDS_ENV !== "production") {
    const port = 4004;
    const { createProxyMiddleware } = require('http-proxy-middleware');
    function app_use_proxy(from, to) {
      const target = `http://localhost:${port}`;
      let pathRewrite = {};
      pathRewrite[`^${from}`] = to;
      app.use(from, createProxyMiddleware({
        target: target,
        pathRewrite: pathRewrite
      }));
    }
    app_use_proxy('/portal/admin-books/webapp/odata', '/odata');
    app_use_proxy('/portal/bookscreate/webapp/odata', '/odata');
    app_use_proxy('/portal/browse/webapp/odata', '/odata');
    app.use('/appconfig', express.static(`${__dirname}/../app/portal/appconfig`));
    app.use('/portal/admin-books', express.static(`${__dirname}/../app/admin-books`));
    app.use('/portal/bookscreate', express.static(`${__dirname}/../app/bookscreate`));
    app.use('/portal/browse', express.static(`${__dirname}/../app/browse`));
    LOG.info("Custom server bootstrap complete with profile", process.env.CDS_ENV);
  }
})