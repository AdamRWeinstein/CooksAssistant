const { USER_TEST_ID } = require('../utils/constants'); //TODO Remove TEST_USER_ID and replace with req.user
const Recipe = require('../models/recipe');
const mongoose = require('mongoose');


async function showDashboard(req, res) {
    try {
        const userId = new mongoose.Types.ObjectId(USER_TEST_ID);
        const recipes = await Recipe.find({ user: userId });
        res.render('dashboard', { recipes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMsg: err.message });
    }
}

module.exports = {
    showDashboard
};