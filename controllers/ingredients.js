const Ingredient = require('../models/ingredient');

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
    createIngredient
};