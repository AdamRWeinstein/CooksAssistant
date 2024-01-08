const Ingredient = require('../models/ingredient');
const mongoose = require('mongoose');

async function getAllIngredients(req, res) {
    try {
        let ingredients = await Ingredient.find();
        res.status(200).json(ingredients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMsg: err.message });
    }
}

async function getIngredientsByName(req, res) {
    try {
        // This assumes names are sent as an array in the query string
        const names = req.query.names;

        if (!names || names.length === 0) {
            return res.status(400).send({ message: "No ingredient names provided" });
        }

        // Query the database for ingredients with these names
        const ingredients = await Ingredient.find({
            name: { $in: names }
        });

        // Send back the found ingredients
        res.status(200).json(ingredients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMsg: err.message });
    }
}


async function getIngredientsById(req, res) {
    try {
        const ingredientIds = req.query.ids.split(',').map(id => new mongoose.Types.ObjectId(id));
        console.log(ingredientIds)
        const ingredients = await Ingredient.find({ '_id': { $in: ingredientIds } });
        console.log(ingredients)
        res.status(200).json(ingredients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMsg: err.message });
    }
}

async function createIngredients(req, res) {
    try {
        // Check if the request body is an array
        if (!Array.isArray(req.body)) {
            // If not, send a bad request response
            return res.status(400).json({ errorMsg: 'Expected an array of ingredients' });
        }

        // Use insertMany to create multiple ingredients
        let ingredients = await Ingredient.insertMany(req.body);

        // Send the created ingredients in the response
        res.status(200).json(ingredients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMsg: err.message });
    }
}

module.exports = {
    getAllIngredients,
    getIngredientsById,
    getIngredientsByName,
    createIngredients
};