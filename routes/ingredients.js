const express = require('express');
const router = express.Router();
const ingredientsController = require('../controllers/ingredients');

router.get('/', ingredientsController.getAllIngredients);
router.post('/', ingredientsController.createIngredient);

module.exports = router;
