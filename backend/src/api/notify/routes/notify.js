module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/notify',
     handler: 'notify.create',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
