const express = require('express');
const { dashboard } = require('../../controllers/wallet/dashboard');
const LoggedInUser = require('../../middlewares/auth');
const router = express.Router();

router.get('/dashdata', LoggedInUser, dashboard);