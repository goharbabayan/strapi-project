const crypto = require('crypto');

module.exports = ({env}) => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET', undefined)
    }
   },
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',
      playgroundAlways: false,
      defaultLimit: 10,
      maxLimit: 100,
      apolloServer: {
        tracing: true,
      },
    }
  },
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY', undefined),
      },
      settings: {
        defaultFrom: env('SENDGRID_DEFAULT_FROM_EMAIL', undefined),
        defaultReplyTo: env('SENDGRID_DEFAULT_REPLY_TO_EMAIL', undefined),
      },
    },
  },
  upload: {
    config: {
      providerOptions: {
        localServer: {
          maxage: 300000
        },
      },
      sizeLimit: 250 * 1024 * 1024 // 256mb in bytes
    },
  }, 
});

