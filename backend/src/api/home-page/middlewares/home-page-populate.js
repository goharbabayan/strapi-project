'use strict';

/**
 * `home-page-populate` middleware
 */
const populate = {
  
};

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In home-page-populate middleware.');
    ctx.query = {
      populate,
      ...ctx.query,
    }
    await next();
  };
};
