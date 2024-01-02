const Recipe = require('../models/recipe');
const RecipeStep = require('../models/recipeStep');
const User = require('../models/user');
const { USER_TEST_ID } = require('../utils/constants'); //TODO Remove USER_TEST_ID

async function getAllRecipes(req, res) {
    const recipes = await Recipe.find({user: USER_TEST_ID});
    res.render('recipes/index', { recipes });
}

async function createRecipeForm(req, res) {
    res.render('recipes/new');
}

async function viewRecipe(req, res) {
    const recipe = await Recipe.findById(req.params.id);
    const steps = await RecipeStep.find({recipeId: req.params.id});
    res.render('recipes/show', { recipe, steps });
}

async function createRecipe(req, res) {
    try {
        let recipe = await Recipe.create(req.body);
        res.redirect(`/recipes/${recipe._id}`);
    } catch (err) {
        console.log(err);
        res.render('/error', { errorMsg: err.message });
    }
}


module.exports = {
    getAllRecipes,
    createRecipeForm,
    viewRecipe,
    createRecipe
  };