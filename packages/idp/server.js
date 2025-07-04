/* eslint-disable no-console */

import * as path from 'node:path';
import * as url from 'node:url';

import { dirname } from 'desm';
import express from 'express'; // eslint-disable-line import/no-unresolved

import Provider from 'oidc-provider'
import tokenExchangeGrant from './token-exchange.js';
// import Account from './support/account.js';
import configuration from './server-configuration.js';
import routes from './routes/express.js';

const __dirname = dirname(import.meta.url);

const { PORT = 4000, ISSUER = `http://localhost:${PORT}` } = process.env;
// configuration.findAccount = Account.findAccount;

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let server;
try {
  const prod = process.env.NODE_ENV === 'production';
    const config = await configuration();
  const provider = new Provider(ISSUER, config);

  if (prod) {
    app.enable('trust proxy');
    provider.proxy = true;

    app.use((req, res, next) => {
      if (req.secure) {
        next();
      } else if (req.method === 'GET' || req.method === 'HEAD') {
        res.redirect(url.format({
          protocol: 'https',
          host: req.get('host'),
          pathname: req.originalUrl,
        }));
      } else {
        res.status(400).json({
          error: 'invalid_request',
          error_description: 'do yourself a favor and only use https',
        });
      }
    });
  }

  // Middleware to dynamically rewrite cookie names with client_id prefix
app.use((req, res, next) => {
  // Helper to get client_id from query, body, or referer
  function getClientId() {
    if (req.query && req.query.client_id) return req.query.client_id;
    if (req.body && req.body.client_id) return req.body.client_id;
    // Try to extract from referer (for some OIDC flows)
    if (req.headers.referer) {
      const url = new URL(req.headers.referer, `http://${req.headers.host}`);
      if (url.searchParams.has('client_id')) return url.searchParams.get('client_id');
    }
    // Try from cookies (for resume/interaction)
    const cookieNames = Object.keys(req.cookies || {});
    const match = cookieNames.find(name => name.startsWith('_') && name.endsWith('_interaction'));
    if (match) return match.slice(1, -'_interaction'.length);
    return null;
  }

  const clientId = getClientId();
  if (clientId) {
    // Incoming: rewrite cookies with prefix to static names
    const cookieMap = req.cookies || {};
    ['interaction', 'resume', 'session'].forEach((base) => {
      const prefixed = `_${clientId}_${base}`;
      if (cookieMap[prefixed]) {
        req.cookies[base] = cookieMap[prefixed];
      }
    });
  }

  // Outgoing: rewrite Set-Cookie headers to add prefix
  const setHeader = res.setHeader.bind(res);
  res.setHeader = function (name, value) {
    if (name.toLowerCase() === 'set-cookie' && clientId) {
      if (Array.isArray(value)) {
        value = value.map(v => v.replace(/^(interaction|resume|session)=/, `_${clientId}_$1=`));
      } else {
        value = value.replace(/^(interaction|resume|session)=/, `_${clientId}_$1=`);
      }
    }
    return setHeader(name, value);
  };
  next();
});

  routes(app, provider);
await tokenExchangeGrant(null, provider);
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(404).end();
});
  app.use(provider.callback());
  server = app.listen(PORT, () => {
    console.log(`application is listening on port ${PORT}, check its /.well-known/openid-configuration`);
  });
} catch (err) {
  if (server?.listening) server.close();
  console.error(err);
  process.exitCode = 1;
}