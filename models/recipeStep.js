const mongoose = require('mongoose');
const { MEASUREMENT_UNITS } = require('../utils/constants');
const Schema = mongoose.Schema;

const recipeStepSchema = new Schema({
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    stepNumber: Number,
    ingredients: [{
        ingredientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        },
        quantity: Number,
        measurementUnit: {
            type: String,
            enum: MEASUREMENT_UNITS,
            required: true
        }
    }],
    instruction: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('RecipeStep', recipeStepSchema);
