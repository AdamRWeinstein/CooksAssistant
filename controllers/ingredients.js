const Ingredient = require('../models/ingredient');



async function getAllIngredients(req, res) {
    try {
        let ingredients = await Ingredient.find();
        res.status(200).json(ingredients).end();
    } catch (err) {
        console.log(err);
        res.send('error', { errorMsg: err.message });
    }
}

async function createIngredient(req, res) {
    try {
        let ingredient = await Ingredient.create(req.body);
        res.status(200).json(ingredient).end();
    } catch (err) {
        console.log(err);
        res.send('error', { errorMsg: err.message });
    }
}

module.exports = {
    getAllIngredients,
    createIngredient
};