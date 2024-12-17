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
      const { id } = ctx.request.body;

      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      } else {
        token = null;
      }
      try {
        if (token) {
          const environment = strapi.config.environment;
          const url = environment === 'development' ? 'http://localhost:3000' : process.env.BASE_FRONT_URL;
          const reviewLink = ctx.request.body ? `${url}/profile-review?token=${token}&userId=${id}` :`${url}/profile-review?token=${token}`;
          // Send email to admin with the review link
          // ToDo: The email template should not be static
          await strapi.plugins['email'].services.email.send({
            from: `${process.env.SENDGRID_DEFAULT_FROM_EMAIL}`,
            to: `${process.env.SENDGRID_DEFAULT_REPLY_TO_EMAIL}`,
            subject: 'Escort profile update awaiting review',
            text: `Escort just filled in or edited information from her dashboard, please review and accept or decline at ${reviewLink}`,
            html: `<p>Escort just filled in or edited information from her dashboard, please review and accept or decline <a href="${reviewLink}">${reviewLink}</a></p>`,
          });
          return ctx.send(JSON.stringify({ message: "Email sent successfully!" }));
        }
      } catch (error) {
        ctx.body = error;
        console.error('Error sending email:', error);
      }
    }
  })
);
