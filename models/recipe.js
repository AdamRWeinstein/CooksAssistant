const mongoose = require('mongoose');
const { MEASUREMENT_UNITS } = require('../utils/constants');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: { type: String, required: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ingredientsSummary: [{
        ingredientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        },
        totalQuantity: Number,
        measurementUnit: {
            type: String,
            enum: MEASUREMENT_UNITS,
            required: true
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);
