module.exports = function (req, res, next) {
  // Check if user is logged in
  if (!req.session || !req.session.user) {
    return res.redirect('/login.html');
  }

  // Check if 2FA is enabled but not yet verified
  if (req.session.user.twofa_enabled && !req.session.twofa_verified) {
    return res.redirect('/verify-2fa.html');
  }

  // User passed checks, continue to the requested route
  next();
};
