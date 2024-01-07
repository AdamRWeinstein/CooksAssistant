// List
const addedIngredients = [];

// Cached Elements
const ingredientNameTextbox = document.getElementById('ingredientName');

// Event Listeners
document.getElementById('addIngredientButton').addEventListener('click', addIngredient);
document.getElementById('addIngredientToStepButton').addEventListener('click', addIngredientToStep);
document.getElementById('addRecipeStepButton').addEventListener('click', addRecipeStep);
document.getElementById('addRecipeButton').addEventListener('click', addRecipe);

// Event Listener Functions
function addIngredient() {
    const ingredientName = ingredientNameTextbox.value;
    ingredientNameTextbox.value = "";
    if (ingredientName) {
        console.log(addedIngredients);
        if (!addedIngredients.find(ingredient => ingredient === ingredientName)) {
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
}

function addIngredientToStep() {
    const selectElement = document.getElementById('ingredientsOptions');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    if(!selectedOption) return;
    const ingredientText = selectedOption.text;
    // Remove selected option from select element
    selectElement.removeChild(selectedOption);
    
    // Create list item element
    const listItem = document.createElement('li');
    listItem.textContent = ingredientText;
    
    // Append list item to the ingredients recipe list
    document.getElementById('ingredientsRecipeList').appendChild(listItem);
}

function addRecipeStep() {
    // Add your code here
}

function addRecipe() {
    // Add your code here
}

// Helper Functions
function addIngredientOption(ingredientId, ingredientName) {
    addedIngredients.push(ingredientName);
    const ingredientOption = document.createElement('option');
    ingredientOption.value = ingredientId;
    ingredientOption.text = ingredientName;
    document.getElementById('ingredientsOptions').appendChild(ingredientOption);
}