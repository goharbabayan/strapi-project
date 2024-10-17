'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('custom-suburb')
      .service('myService')
      .getWelcomeMessage();
  },
});
