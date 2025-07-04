import findAccount from './users.js';

const COOKIE_SECRET = process.env.COOKIE_SECRET || 'idp-cookie-secret';
export default async function makeConfiguration() {
  return {
    extraTokenClaims: function (_, token) {
      return {
        accountId: token.accountId,
      };
    },
    clients: [
      {
        client_id: 'client-todo0',
        client_secret: 'example-secret-todo0',
        grant_types: [
          'authorization_code',
          'refresh_token',
          'urn:ietf:params:oauth:grant-type:token-exchange',
        ],
        redirect_uris: [
          'http://localhost:5001/openid/callback/customer1',
          'http://localhost:5000/openid/callback/',
        ],
        response_types: ['code'],
        token_endpoint_auth_method: 'client_secret_basic',
      },
      {
        client_id: 'client-wiki0',
        client_secret: 'example-secret-wiki0',
        grant_types: [
          'authorization_code',
          'refresh_token',
          'urn:ietf:params:oauth:grant-type:token-exchange',
        ],
        redirect_uris: [
          'http://localhost:5000/openid/callback/customer1',
          'http://localhost:5000/openid/callback/',
        ],
        response_types: ['code'],
        token_endpoint_auth_method: 'client_secret_basic',
      },
    ],
    features: {
      // userinfo disabled means that the profile info will get stored as claims on the idtoken jwt
      userinfo: { enabled: true },
      registration: { enabled: true },
      introspection: { enabled: true },
      devInteractions: { enabled: true }, // Re-enable devInteractions for development
      // registration: { enabled: false }, // Enable dynamic client registration
    },
    formats: {
      AccessToken: 'jwt',
    },
    claims: {
      // default values - start
      acr: null,
      auth_time: null,
      iss: null,
      openid: ['sub'],
      sid: null,
      // default values - end

      // custom claims - start
      address: ['address'],
      email: ['email', 'email_verified'],
      phone: ['phone_number', 'phone_number_verified'],
      profile: [
        'birthdate',
        'email',
        'family_name',
        'gender',
        'given_name',
        'locale',
        'middle_name',
        'name',
        'nickname',
        'picture',
        'preferred_username',
        'profile',
        'updated_at',
        'website',
        'zoneinfo',
        'app_org',
      ],
      // custom claims - end
    },
    cookies: {
      keys: [COOKIE_SECRET],
      long: {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        // secure: true, // for production
      },
      names: {
        interaction: '_idp_interaction',
        resume: '_idp_interaction_resume',
        session: '_idp_session',
      },
      short: {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        // secure: true, // for production
      },
    },
    jwks: {
      keys: [
        {
          kty: 'RSA',
          kid: 'demo-key',
          use: 'sig',
          alg: 'RS256',
          n: 'zlgeyAmqj-u4WOOk2pFO9zX7rENvVmZMOjP8Up1GCyfUy3ITUgrm18-8IjWKbFGN-PUjYSV_MWJMWr2N342gjl6X5j1O9jS0VvyamCqThKkcpvFhh5iL1CD7Xu0JPqa2v4MmPCDrPYHJa1j7Qu-1OqLPpLH4yHJr-M0jGreLgpJwaSGeShhFijDjoNZy5X2Og_DU8gauqOjqHmNO-e_MFdKjY6ugbhPmCsGIAdSeyHSJJhp1b6L_e4X-JQPVGNrIfiwOGiGG56a62b7ssSoYjviq-i51P0yWRmWd9N61PUUKuIWViBd2boROwypYCAwW3dwiiUcU9Br8ZxSTvHZqbw',
          e: 'AQAB',
          d: 'xgHHn_uuoab4YswoQNkZpp414MthRs6prVx_cCOduEzDpWrVYXA2rreYeFdaerEUBOfvyGQ8Fv6V-KlXQEPe41-gcf85C4ft2l9SVlzc7Ht_lC-jgIQBAlGYBjJ-IZHHYiWPBjosovwtdYaQrl3qUdc0XH2wF2G9fKYVXqjtBiCWjNPVvJDeLWBcvjOC66PeVjTLwr8cE03jvmpdHpsasDOQO2OPVkRzJ6Px1wVGzmq_njXghH1AP5HvLr0eospb4UEUSpI3bPBvxGNjRlPDvB0fEwfmWu8hdMYvBBEHiGmRzHarpz4o77ovX2qJdG4GB_pbelY05ELgOkcrV1gbWQ',
          p: '_30v-APEzYaZFFnsfK65poHB0WBoKVLc_KZDzvQxH5Aj0uFkcZzcIk_o6jVqCMi4qKrwZZh5BWodtR5eTIRhE9gFAQd9cB-a9ujUhXHzT_ccmHE7kFyyM08fgkmHiT3th7E0NsmIXhircyaZTGPhGknKJarAfrNowvQB4MPf5Fs',
          q: 'zsHFMhBSePg6xi9W9Aw3KLpLkNKev-D0PooR9oP5pw7hJ5Ws9XAYwrtwqGcY1_gqDadHt7_0OIAg8Z0lXwbp_PY-NwnpUZwrOHoNNoKRKg20uonuEJBm9Ms00Rbyxk5uLB-0CuKNcyTouZMGewf0SH4BdHdzHKfv9DxBgEbn3n0',
          dp: 'fe0ILag94kdLQDqqUzITkzw1eauY63VKMsUIewLlC3eSEKjDRzRXVBoq5PV60-WLDqdiYdDrJX4OMm1LcU92Qb-hh8ZXT2JkkPpldXiawnk8AO8euqLVunBvSVpQkZaScuUmpTJkImzqZJFL0dkQ5FImbrZgtpJbOmvmWRByVC0',
          dq: 'Amt0IlzcijvlfDJLozmNX7WmcsB0SSyZzy2QfkEXJ-RdsDfpOUohkA3fiKkEOmrWGyjNBxKBCjQ9rnY3XMBY9rPvEHfWOjVIsDWFeBDZIBPe_JvmpFz8R3slWBkbqER8t5l7YvE51JInAxz8Y245ZqvK2pEXUMuKXGJkJdsulYU',
          qi: 'YgNPmw1ld0yF1Je0aj6FOsVp-uVCzdFXYSwbQVzOm4uakxQRhzR5Ny5YVZ3ILJ8woUx0MZWxASOusWOA7viq0SUGNRiRDVednmL35riK4vT6hZ1BKhz17u-OpghIOwBA362J1ra3ULfyVi-uAYXEQ7GG_vWPGiyODOCbbG-wmuQ',
        },
      ],
    },
    // For demo, use a simple Account model
    findAccount: findAccount,
    // Add more configuration as needed
  };
}
