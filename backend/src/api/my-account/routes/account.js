module.exports = {
  routes: [
    {
      method: "POST",
      path: "/profile-review/:token",
      handler: "my-account.generateReviewLink",
    },
  ]
}
