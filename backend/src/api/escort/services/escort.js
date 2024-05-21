'use strict';

/**
 * escort service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::escort.escort');
