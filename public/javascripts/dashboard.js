// Nav
document.querySelectorAll('.recipe').forEach(function (element) {
    element.addEventListener('click', function (event) {
        event.preventDefault();
    });
});

// Create
let stepCount = 1;

document.getElementById('addIngredientButton1').addEventListener('click', handleAddIngredientClick);
document.getElementById('addStepButton').addEventListener('click', () => {
    stepCount++;
    const newStep = document.querySelector('.step').cloneNode(true);

    // Update the ID of the new step and its child elements
    newStep.id = 'step' + stepCount;
    const header = newStep.querySelector('h1');
    header.textContent = "Step " + stepCount;
    const instructions = newStep.querySelector('textarea');
    instructions.id = 'recipeStep' + stepCount;
    instructions.classList.add('recipeStep');
    instructions.placeholder = 'Step ' + stepCount;
    instructions.value = '';
    const addIngredientButton = newStep.querySelector('.ingredients button');
    addIngredientButton.classList.add('addIngredientButton');
    addIngredientButton.id = 'addIngredientButton' + stepCount;
    addIngredientButton.addEventListener('click', handleAddIngredientClick)

    const ingredientsContainer = newStep.querySelector('.ingredients div');
    ingredientsContainer.id = 'ingredientsContainer' + stepCount;
    ingredientsContainer.classList.add('ingredientsContainer');
    newStep.querySelector('.ingredients div').innerHTML = '';

    // Insert the new step into the document
    const buttonsContainer = document.getElementById('buttonsContainer');
    document.querySelector('.container.create').insertBefore(newStep, buttonsContainer);

});
document.getElementById('removeStepButton').addEventListener('click', () => {
    const steps = document.querySelectorAll('.step');
    const lastStep = steps[steps.length - 1];
    lastStep.remove();
    stepCount--;
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
    console.log(stepsWithIngredients);
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
                instructions: step.instructions
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
    ingredientWrapper.classList.add('ingredient');

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

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteButton');
    deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 50 59" class="bin">
            <path fill="#B5BAC1" d="M0 7.5C0 5.01472 2.01472 3 4.5 3H45.5C47.9853 3 50 5.01472 50 7.5V7.5C50 8.32843 49.3284 9 48.5 9H1.5C0.671571 9 0 8.32843 0 7.5V7.5Z"></path>
            <path fill="#B5BAC1" d="M17 3C17 1.34315 18.3431 0 20 0H29.3125C30.9694 0 32.3125 1.34315 32.3125 3V3H17V3Z"></path>
            <path fill="#B5BAC1" d="M2.18565 18.0974C2.08466 15.821 3.903 13.9202 6.18172 13.9202H43.8189C46.0976 13.9202 47.916 15.821 47.815 18.0975L46.1699 55.1775C46.0751 57.3155 44.314 59.0002 42.1739 59.0002H7.8268C5.68661 59.0002 3.92559 57.3155 3.83073 55.1775L2.18565 18.0974ZM18.0003 49.5402C16.6196 49.5402 15.5003 48.4209 15.5003 47.0402V24.9602C15.5003 23.5795 16.6196 22.4602 18.0003 22.4602C19.381 22.4602 20.5003 23.5795 20.5003 24.9602V47.0402C20.5003 48.4209 19.381 49.5402 18.0003 49.5402ZM29.5003 47.0402C29.5003 48.4209 30.6196 49.5402 32.0003 49.5402C33.381 49.5402 34.5003 48.4209 34.5003 47.0402V24.9602C34.5003 23.5795 33.381 22.4602 32.0003 22.4602C30.6196 22.4602 29.5003 23.5795 29.5003 24.9602V47.0402Z" clip-rule="evenodd" fill-rule="evenodd"></path>
            <path fill="#B5BAC1" d="M2 13H48L47.6742 21.28H2.32031L2 13Z"></path>
        </svg>
    `;

    // Step 4: Append elements to the wrapper
    ingredientWrapper.appendChild(name);
    ingredientWrapper.appendChild(quantity);
    ingredientWrapper.appendChild(measurementUnit);
    ingredientWrapper.appendChild(deleteButton);

    // Step 5: Attach an event listener to the delete button
    deleteButton.addEventListener('click', function() {
        ingredientsContainer.removeChild(ingredientWrapper);
    });

    // Step 5: Append the wrapper to the container
    ingredientsContainer.appendChild(ingredientWrapper);
}

// View
