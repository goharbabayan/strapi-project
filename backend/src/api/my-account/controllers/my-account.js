'use strict';

/**
 * my-account controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::my-account.my-account',
  ({ strapi }) => ({
    async generateReviewLink(ctx) {
      let token;
      const parts = ctx.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      } else {
        token = null;
      }
      try {
        if (token) {
          const environment = strapi.config.environment;
          const url = environment === 'development' ? 'http://localhost:3000' : process.env.BASE_FRONT_URL;
          const reviewLink = `${url}/profile-review?token=${token}`;
          // Send email to admin with the review link
          // ToDo: The email template should not be static
          await strapi.plugins['email'].services.email.send({
            from: `${process.env.SENDGRID_DEFAULT_FROM_EMAIL}`,
            to: `${process.env.SENDGRID_DEFAULT_REPLY_TO_EMAIL}`,
            subject: 'New User Registration for Approval',
            text: `A new user has registered. Please review the user at ${reviewLink}`,
            html: `<p>A new user has registered. Please review the user at <a href="${reviewLink}">${reviewLink}</a></p>`,
          });
          ctx.body = JSON.stringify('ok');
        }
      } catch (error) {
        ctx.body = error;
        console.error('Error sending email:', error);
      }
    }
  })
);
