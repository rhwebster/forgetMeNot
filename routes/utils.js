const csrf = require("csurf");

const csrfProtection = csrf({ cookie: { signed: false } }); //TODO: change this back to true when we finished session-cookie

const asyncHandler = (handler) => (req, res, next) =>
  handler(req, res, next).catch(next);

module.exports = {
  csrfProtection,
  asyncHandler,
};
