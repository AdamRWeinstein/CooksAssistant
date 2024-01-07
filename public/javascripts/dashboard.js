let stepCount = 1;

document.getElementById('addIngredientButton1').addEventListener('click', handleAddIngredientClick);
document.getElementById('addStepButton').addEventListener('click', () => {
    stepCount++;
    const newStep = document.querySelector('.step').cloneNode(true);

    // Update the ID of the new step and its child elements
    newStep.id = 'step' + stepCount;
    const instructions = newStep.querySelector('textarea');
    instructions.id = 'recipeStep' + stepCount;
    instructions.placeholder = 'Step ' + stepCount;
    instructions.value = '';
    const addIngredientButton = newStep.querySelector('.ingredients button');
    addIngredientButton.id = 'addIngredientButton' + stepCount;
    addIngredientButton.addEventListener('click', handleAddIngredientClick)

    newStep.querySelector('.ingredients div').id = 'ingredientsContainer' + stepCount;
    newStep.querySelector('.ingredients div').innerHTML = '';

    // Insert the new step into the document
    const buttonsContainer = document.getElementById('buttonsContainer');
    document.querySelector('.container.create').insertBefore(newStep, buttonsContainer);

});
document.getElementById('saveRecipeButton').addEventListener('click', async () => {
    // Step 1: Get all the Recipe Steps and their ingredients
    const stepsWithIngredients = Array.from(document.querySelectorAll('.step')).map((step, stepIndex) => {
        const ingredients = Array.from(step.querySelectorAll('.ingredients > div div')).map(ingredientDiv => {
            return {
                stepIndex,
                name: ingredientDiv.querySelector('input[type="text"]').value,
                quantity: ingredientDiv.querySelector('input[type="number"]').value,
                measurementUnit: ingredientDiv.querySelector('select').value
            };
        });
        const instructions = step.querySelector('textarea').value;
        return { stepIndex, ingredients, instructions };
    });
    // Step 2: Flatten the ingredients array for processing
    const ingredientsArray = stepsWithIngredients.flatMap(step => step.ingredients);

    // Step 3: Write the Ingredients to the database if they do not exist
    try {
        // Step 3a: Get existing ingredients
        const ingredientNames = ingredientsArray.map(ingredient => ingredient.name);
        const existingIngredientsResponse = await axios.get('/ingredients/byName', {
            params: { names: ingredientNames }
        });
        const existingIngredients = existingIngredientsResponse.data;

        // Step 3b: Update existing ingredients with their IDs and separate new ingredients
        const newIngredients = [];
        ingredientsArray.forEach(ingredient => {
            const found = existingIngredients.find(e => e.name === ingredient.name);
            if (found) {
                // Update ingredient with the ID from the response
                ingredient.id = found.id;
            } else {
                // This ingredient is new and needs to be added
                newIngredients.push(ingredient);
            }
        });

        // POST new ingredients if any
        if (newIngredients.length > 0) {
            const response = await axios.post('/ingredients', newIngredients);
            const newIngredientIds = response.data.map(ingredient => ingredient._id);

            // Assign the IDs to the new ingredients
            newIngredients.forEach((ingredient, index) => {
                ingredient.id = newIngredientIds[index];
            });
        }
    } catch (error) {
        console.error('Error processing recipe:', error);
        // Handle error (e.g., show error message)
    }

    // Step 4: Re-associate ingredient IDs to their steps
    let ingredientIndex = 0;

    stepsWithIngredients.forEach(step => {
        step.ingredients.forEach(ingredient => {
            const flatIngredient = ingredientsArray[ingredientIndex];
            if (flatIngredient.id) {
                ingredient.id = flatIngredient.id;
            }

            ingredientIndex++;
        });
    });

    // Step 5: Write the Recipe to the database
    const recipeName = document.getElementById('recipeName').value;
    const userId = USER_TEST_ID //TODO Replace USER_TEST_ID with logged in user
    let recipeId;
    try {
        const response = await axios.post('/recipes', { name: recipeName, user: userId });
        recipeId = response.data._id;
    } catch (error) {
        console.error('Error processing recipe:', error);
        // Handle error (e.g., show error message)
    }

    // Step 6: Write the Recipe Steps to the database with reference to the Recipe ID and Ingredient IDs
    try {
        const recipeStepsData = stepsWithIngredients.map(step => {
            return {
                recipeId,
                stepNumber: step.stepIndex + 1,
                ingredients: step.ingredients.map(ingredient => ({
                    ingredientId: ingredient.id,
                    quantity: ingredient.quantity,
                    measurementUnit: ingredient.measurementUnit
                })),
                instructions
            }
        });
        const response = await axios.post('/recipeSteps', recipeStepsData);
    } catch (error) {
        console.error('Error processing recipe:', error);
        // Handle error (e.g., show error message)
    }
});

function handleAddIngredientClick(event) {
    // Step 1: Identify the corresponding ingredientsContainer
    const ingredientsDiv = event.target.closest('.ingredients');
    const ingredientsContainer = ingredientsDiv.querySelector('div[id^="ingredientsContainer"]');

    // Step 2: Create new elements
    // Create a div to wrap the elements
    const ingredientWrapper = document.createElement('div');

    // Create a text field
    const name = document.createElement('input');
    name.type = 'text';
    name.placeholder = 'Ingredient Name';

    // Create a number field
    const quantity = document.createElement('input');
    quantity.type = 'number';
    quantity.placeholder = 'Quantity';

    // Create a selector
    const measurementUnit = document.createElement('select');

    // Step 3: Append options to the selector
    // Note, constant MEASUREMENT_UNITS loaded in on views/dashboard.ejs
    MEASUREMENT_UNITS.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.text = unit;
        measurementUnit.appendChild(option);
    });

    // Step 4: Append elements to the wrapper
    ingredientWrapper.appendChild(name);
    ingredientWrapper.appendChild(quantity);
    ingredientWrapper.appendChild(measurementUnit);

    // Step 5: Append the wrapper to the container
    ingredientsContainer.appendChild(ingredientWrapper);
}