module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/watermark-images',
      handler: 'watermark-images.apply',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
