const Recipe = require('../models/recipe');

async function showDashboard(req, res) {
    try {
        const userId = req.user._id;
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