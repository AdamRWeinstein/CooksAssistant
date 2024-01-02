const express = require('express');
const router = express.Router();
const recipeStepsController = require('../controllers/recipeSteps');

router.post('/', recipeStepsController.createRecipeStep);

module.exports = router;
