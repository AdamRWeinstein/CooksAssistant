const express = require('express');
const router = express.Router();
const ingredientsController = require('../controllers/ingredients');

router.get('/', ingredientsController.getAllIngredients);
router.get('/byName', ingredientsController.getIngredientsByName);
router.post('/', ingredientsController.createIngredients);

module.exports = router;
