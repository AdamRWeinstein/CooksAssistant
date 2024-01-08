const Recipe = require('../models/recipe');
const RecipeStep = require('../models/recipeStep');

async function getAllRecipes(req, res) {
    const recipes = await Recipe.find({ user: req.user._id });
    res.render('recipes/index', { recipes });
}

async function createRecipeForm(req, res) {
    res.render('recipes/new');
}

async function viewRecipe(req, res) {
    const recipe = await Recipe.findById(req.params.id);
    const steps = await RecipeStep.find({ recipeId: req.params.id });
    res.render('recipes/show', { recipe, steps });
}

async function createRecipe(req, res) {
    try {
        let recipe = await Recipe.create(req.body);
        res.status(200).json(recipe);
    } catch (err) {
        console.log(err);
        res.send('error', { errorMsg: err.message });
    }
}

async function deleteRecipe(req, res) {
    try {
        const recipeId = req.params.recipeId;
        
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Check if the currently logged in user is the creator of the recipe
        if (recipe.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to delete this recipe' });
        }

        // Delete associated recipe steps
        await RecipeStep.deleteMany({ recipeId });

        // Delete the recipe
        await Recipe.findByIdAndDelete(recipeId);

        res.status(200).json({ message: 'Recipe and associated data deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMsg: err.message });
    }
}

module.exports = {
    getAllRecipes,
    createRecipeForm,
    viewRecipe,
    createRecipe,
    deleteRecipe
};