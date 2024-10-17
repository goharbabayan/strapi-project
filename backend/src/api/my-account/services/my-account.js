'use strict';

/**
 * my-account service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::my-account.my-account');
