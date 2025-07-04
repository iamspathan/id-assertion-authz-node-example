import { dirname } from 'desm';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import * as path from 'node:path';
import Provider from 'oidc-provider';
import interactionRoutes from './routes/interaction.js';
import makeConfiguration from './server-configuration.js';
import tokenExchangeGrant from './token-exchange.js';
// Load environment variables
dotenv.config();

const __dirname = dirname(import.meta.url);

const PORT = process.env.IDP_PORT || 4000;
const ISSUER = process.env.IDP_ISSUER || `http://localhost:${PORT}`;
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'idp-cookie-secret';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: COOKIE_SECRET,
  cookie: {
    http: false,
    sameSite: 'lax',
    path: "/",
    secure
  },
}));

const provider = new Provider(ISSUER, await makeConfiguration());
await tokenExchangeGrant(null, provider);

// Make the provider available to routes for interactionFinished
app.set('oidcProvider', provider);
app.use(interactionRoutes);

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(404).end();
});

app.use(provider.callback());

app.listen(PORT, () => {
  console.log(`IDP listening on ${ISSUER} (port ${PORT})`);
  console.log(`OIDC discovery: ${ISSUER}/.well-known/openid-configuration`);
});
