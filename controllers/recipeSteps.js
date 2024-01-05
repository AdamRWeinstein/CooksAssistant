const RecipeStep = require('../models/recipeStep');

async function createRecipeStep(req, res) {
    try {
        let recipeStep = await RecipeStep.create({
            recipeId: req.body.recipeId,
            stepNumber: req.body.stepNumber,
            ingredients: req.body.ingredients,
            instruction: req.body.instruction
        });
        res.status(200).json(recipeStep).end();
    } catch (err) {
        console.log(err);
        res.render('error', { errorMsg: err.message });
    }
}

module.exports = {
    createRecipeStep
};