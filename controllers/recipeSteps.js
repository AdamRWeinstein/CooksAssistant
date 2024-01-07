const RecipeStep = require('../models/recipeStep');

async function createRecipeSteps(req, res) {
    // Check if the request body is an array
    if (!Array.isArray(req.body)) {
        // If not, send a bad request response
        return res.status(400).json({ errorMsg: 'Expected an array of ingredients' });
    }

    try {
        let recipeSteps = await RecipeStep.insertMany(req.body);
        res.status(200).json(recipeSteps);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMsg: err.message });
    }
}

module.exports = {
    createRecipeSteps
};