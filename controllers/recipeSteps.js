const RecipeStep = require('../models/recipeStep');
const Ingredient = require('../models/ingredient');

async function createRecipeStep(req, res) {
    try {
        // Create new ingredients
        let ingredients = [];
        for(const ingredientData of req.body.ingredients) {
            let newIngredient = await Ingredient.create({
                name: ingredientData.name
            });
            ingredients.push({
                ingredientId: newIngredient._id,
                quantity: ingredientData.quantity,
                measurementUnit: ingredientData.measurementUnit
            });
        }
        // Create new recipe step with those ingredients
        let recipeStep = await RecipeStep.create({
            recipeId: req.body.recipeId,
            stepNumber: req.body.stepNumber,
            ingredients: ingredients,
            instruction: req.body.instruction
        });
        res.redirect(`/recipes/${recipeStep.recipe}`);
    } catch (err) {
        console.log(err);
        res.render('error', { errorMsg: err.message });
    }
}

module.exports = {
    createRecipeStep
};