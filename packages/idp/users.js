// Static user store for oidc-provider
const users = new Map();

// // Add a static user with a claims() method
// users.set('user-bob', {
//   accountId: 'user-bob',
//   email: 'bob@tables.fake',
//   name: 'Bob Tables',
//   claims: async function (use, scope) {
//     return {
//       sub: this.accountId,
//       email: this.email,
//       name: this.name,
//     };
//   },
// });

export default async (ctx, id) => ({
  accountId: id,
  claims: async function (use, scope) {
    return {
      sub: this.accountId,
      email: this.email,
      name: this.name,
    };
  },
  profile: {
    sub: id,
    name: 'Bob Tables',
    email: 'bob@tables.fake',
    emails: ['bob@tables.fake'],
  },
});
