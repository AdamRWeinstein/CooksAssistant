const express = require('express');
const router = express.Router();

const recipesCtrl = require('../controllers/recipes')

router.get('/', recipesCtrl.getAllRecipes);
router.get('/new', recipesCtrl.createRecipeForm);
router.get('/:id', recipesCtrl.viewRecipe);
router.post('/', recipesCtrl.createRecipe);

module.exports = router;