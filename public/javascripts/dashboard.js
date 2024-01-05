const axios = require('axios');

// List
ingredientList = [];

// Event Listeners
document.getElementById('addIngredientButton').addEventListener('click', addIngredient);
document.getElementById('addRecipeStepButton').addEventListener('click', addRecipeStep);
document.getElementById('addRecipeButton').addEventListener('click', addRecipe);

// Event Listener Functions
function addIngredient() {
    const ingredientName = document.getElementById('ingredientName').value;
    if (ingredientName) {
        axios.get('/ingredients')
            .then(response => {
                const ingredients = response.data;
                // Check if ingredient already exists
                const existingIngredient = ingredients.find(ingredient => ingredient.name === ingredientName)
                if (existingIngredient) {
                    addIngredientOption(existingIngredient.id, ingredientName)
                } else {
                    axios.post('/ingredients', { name: ingredientName })
                        .then(response => {
                            addIngredientOption(response.data.id, ingredientName)
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            })
            .catch(error => {
                console.error(error);
            })
    }
}

function addRecipeStep() {
    // Add your code here
}

function addRecipe() {
    // Add your code here
}

// Helper Functions
function addIngredientOption(ingredientId, ingredientName) {
    const ingredientOption = document.createElement('option');
    ingredientOption.value = ingredientId;
    ingredientOption.text = ingredientName;
    document.getElementById('ingredientsOptions').appendChild(ingredientOption);
}