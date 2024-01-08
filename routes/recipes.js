const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes')

router.get('/', recipesController.getAllRecipes);
router.post('/', recipesController.createRecipe);
router.delete('/:recipeId', recipesController.deleteRecipe);

module.exports = router;