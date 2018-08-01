const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const UsersController = require('../controllers/user');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

router.route("/signup")
    .post(validateBody(schemas.userSchema), UsersController.signUp);

router.route("/signin")
    .post(validateBody(schemas.userSchema), passportSignIn, UsersController.signIn);

router.route("/secret")
    .get(passportJWT, UsersController.secret);

module.exports = router;