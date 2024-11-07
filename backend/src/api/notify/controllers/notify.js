'use strict';

/**
 * A set of functions called "actions" for `notify`
 */
function checkTwoArraysDiffer(oldArray, newArray) {
  if (oldArray.length !== newArray.length) {
      return true;
  }

  for (let i = 0; i < oldArray.length; i++) {
      const oldObj = oldArray[i];
      const newObj = newArray[i];

      if (
          oldObj.id !== newObj.id ||
          oldObj.workday !== newObj.workday ||
          oldObj.start !== newObj.start ||
          oldObj.end !== newObj.end
      ) {
          return true;
      }
  }

  return false;
}

module.exports = {
  async create(ctx) {
    if (ctx.request.body.model === "user") {
      // Fetch users interested in this category
      const interestedUsers = await strapi.entityService.findMany(
        "api::subscriber.subscriber",
        {
          filters: {
            provider: ctx.request.body.entry.username,
          },
        }
      );

      // Send email to each user
      for (const user of interestedUsers) {
        if (checkTwoArraysDiffer(Array.from(user.schedule), ctx.request.body.entry.schedule)) {
          strapi.plugins["email"].services.email.send({
            to: user.email,
            from: process.env.SENDGRID_DEFAULT_FROM_EMAIL,
            subject: "User Update",
            text: "User data is updates",
          });
          await strapi.entityService.delete("api::subscriber.subscriber", user.id);
        }
      }
    }

    return ctx.send({ message: "Emails sent successfully!" });
  },
}
