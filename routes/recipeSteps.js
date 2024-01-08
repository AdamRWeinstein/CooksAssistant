const express = require('express');
const router = express.Router();
const recipeStepsController = require('../controllers/recipeSteps');

router.get('/:recipeId', recipeStepsController.getRecipeStepsByRecipeId);
router.post('/', recipeStepsController.createRecipeSteps);

module.exports = router;
