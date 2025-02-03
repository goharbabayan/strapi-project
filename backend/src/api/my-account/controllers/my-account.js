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
      const { id, action } = ctx.request.body;
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      } else {
        token = null;
      }
      try {
        if (token) {
          const environment = strapi.config.environment;
          const url = environment === 'development' ? 'http://localhost:3000' : process.env.BASE_FRONT_URL;
          const reviewLink = ctx.request.body ? `${url}/profile-review?token=${token}&userId=${id}&action=${action}` :`${url}/profile-review?token=${token}`;
          let emailText, emailSubject;
          if (action === 'data_change') {
            emailText = `Escort just edited information from her dashboard. Please review and accept/decline here: `;
            emailSubject= `Escort profile update awaiting review`;
          } else if (action === 'verification_upgrade') {
            emailText = `Escort just requested a verification status level upgrade. Please review and accept/decline here:`;
            emailSubject= `Escort Verification Level Upgrade Request`;
          } else if (action === 'get_verification') {
            emailText = `Escort has submitted a request for profile verification. Review and approve/decline here: `;
            emailSubject= `Escort Profile Verification Request`;
          };
          // Send email to admin with the review link
          // ToDo: The email template should not be static
          await strapi.plugins['email'].services.email.send({
            from: `${process.env.SENDGRID_DEFAULT_FROM_EMAIL}`,
            to: `${process.env.SENDGRID_DEFAULT_REPLY_TO_EMAIL}`,
            subject: emailSubject,
            text: `${emailText} at ${reviewLink}`,
            html: `<p>${emailText} <a href="${reviewLink}">${reviewLink}</a></p>`,
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
