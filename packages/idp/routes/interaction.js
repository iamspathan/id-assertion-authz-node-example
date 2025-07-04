import express from 'express';

const router = express.Router();

// For development: mock a valid session for the interaction
router.get('/interaction/:uid', async (req, res) => {
  // Mock a valid session for oidc-provider
  req.session.interaction_uid = req.params.uid;

  req.session['oidc:interactions'] = {};
  req.session['oidc:interactions'][req.params.uid] = {
    // params: {
    //   client_id: 'todo0', // or 'wiki0', adjust as needed
    //   // add any other required params here
    // },
    session: {
      accountId: req.query.accountId || 'user-bob',
    },
  };

  const provider = req.app.get('oidcProvider');
  const result = {
    login: {
      accountId: req.query.accountId || 'user-bob',
      remember: true,
    },
  };
  provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
});

export default router;
