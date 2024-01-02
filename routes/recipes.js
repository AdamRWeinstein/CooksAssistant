const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes')

router.get('/', recipesController.getAllRecipes);
router.get('/new', recipesController.createRecipeForm);
router.get('/:id', recipesController.viewRecipe);
router.post('/', recipesController.createRecipe);

module.exports = router;