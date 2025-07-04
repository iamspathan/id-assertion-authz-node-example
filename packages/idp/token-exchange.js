// Register the token-exchange grant type for the IDP
import { OAuthGrantType } from 'id-assert-authz-grant-client';
import * as jose from 'jose';
import makeConfiguration from './server-configuration.js';

export default async function tokenExchangeGrant(_, provider) {
  const parameters = [
    'requested_token_type',
    'resource',
    'scope',
    'subject_token',
    'subject_token_type',
    // Add more as needed
  ];

  async function tokenExchangeHandler(ctx, next) {
    try {
      // Validate required parameters according to RFC and requestIdJwtAuthzGrant
      const { requested_token_type, resource, scope, subject_token, subject_token_type } =
        ctx.oidc.params;

      // Validate presence
      if (!requested_token_type) {
        ctx.status = 400;
        ctx.body = { error: 'invalid_request', error_description: 'Missing requested_token_type' };
        return;
      }
      if (!resource) {
        ctx.status = 400;
        ctx.body = { error: 'invalid_request', error_description: 'Missing resource' };
        return;
      }
      if (!subject_token) {
        ctx.status = 400;
        ctx.body = { error: 'invalid_request', error_description: 'Missing subject_token' };
        return;
      }
      if (!subject_token_type) {
        ctx.status = 400;
        ctx.body = { error: 'invalid_request', error_description: 'Missing subject_token_type' };
        return;
      }

      // Only support subject_token_type: id_token for now
      if (subject_token_type !== 'urn:ietf:params:oauth:token-type:id_token') {
        ctx.status = 400;
        ctx.body = {
          error: 'invalid_request',
          error_description: 'Only subject_token_type=id_token is supported',
        };
        return;
      }

      // Decode the subject_token (id_token) to extract the 'sub' claim
      let subjectSub;
      console.log('subject_token:', subject_token);
      try {
        const decodedJWT = jose.decodeJwt(subject_token);
        if (decodedJWT && decodedJWT.sub) {
          subjectSub = decodedJWT.sub;
        } else {
          console.warn('No sub claim found in subject_token');
        }
      } catch (e) {
        console.error('Failed to decode subject_token:', e);
      }
      const now = Math.floor(Date.now() / 1000);
      const configuration = await makeConfiguration();
      const jwk = configuration.jwks.keys[0];
      const privateKey = await jose.importJWK(jwk, 'RS256');
      const payload = {
        iss: ctx.oidc.issuer, // issuer
        sub: subjectSub, // derived from subject_token
        aud: resource, // audience is the resource
        iat: now,
        client_id: 'wiki0-at-todo0',
        exp: now + 3600,
        scope: '',
        // Add more claims as needed per RFC
      };
      const jwt = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'RS256', typ: 'oauth-id-jag+jwt' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(privateKey);

      ctx.body = {
        access_token: jwt,
        issued_token_type: 'urn:ietf:params:oauth:token-type:id-jag',
        token_type: 'n_a',
        expires_in: 3600,
        scope,
      };
      await next();
    } catch (err) {
      console.error('Token exchange internal error:', err);
      ctx.status = 500;
      ctx.body = {
        error: 'server_error',
        error_description: 'Internal error during token exchange. See server logs.',
      };
    }
  }

  provider.registerGrantType(OAuthGrantType.TOKEN_EXCHANGE, tokenExchangeHandler, parameters);
}
