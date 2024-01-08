const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


router.get('/', ensureAuthenticated, dashboardController.showDashboard);

module.exports = router;
