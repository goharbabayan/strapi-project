'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/users/count',
    handler: 'user.count',
    config: {
      prefix: '',
    },
  },
  {
    method: 'GET',
    path: '/users',
    handler: 'user.find',
    config: {
      prefix: '',
    },
  },
  {
    method: 'GET',
    path: '/users/me',
    handler: 'user.me',
    config: {
      prefix: '',
    },
  },
  {
    method: 'GET',
    path: '/users/:id',
    handler: 'user.findOne',
    config: {
      prefix: '',
    },
  },
  {
    method: 'POST',
    path: '/users',
    handler: 'user.create',
    config: {
      prefix: '',
    },
  },
  {
    method: 'PUT',
    path: '/users/:id',
    handler: 'user.update',
    config: {
      prefix: '',
    },
  },
  {
    method: 'PUT',
    path: '/members/:id',
    handler: 'user.updateMember',
    config: {
      prefix: '',
    },
  },
  {
    method: 'DELETE',
    path: '/users/:id',
    handler: 'user.destroy',
    config: {
      prefix: '',
    },
  },
  {
    method: 'DELETE',
    path: '/members/:id',
    handler: 'user.deleteMember',
    config: {
      prefix: '',
    },
  },
  {
    method: 'GET',
    path: '/user/favorites',
    handler: 'user.findUsersByIds',
    config: {
      prefix: '',
    },
  },
  {
    method: 'POST',
    path: '/user/addToFavorites',
    handler: 'user.addToFavorites',
    config: {
      prefix: '',
    },
  },
  {
    method: 'POST',
    path: '/user/findFromFavorites',
    handler: 'user.findFromFavorites',
    config: {
      prefix: '',
    },
  },
  {
    method: 'POST',
    path: '/user/addReview/:id',
    handler: 'user.createReview',
    config: {
      prefix: '',
    },
  },
];
