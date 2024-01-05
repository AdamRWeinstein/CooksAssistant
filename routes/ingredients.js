const express = require('express');
const router = express.Router();
const ingredientsController = require('../controllers/recipeSteps');

router.post('/', ingredientsController.createIngredient);

module.exports = router;
