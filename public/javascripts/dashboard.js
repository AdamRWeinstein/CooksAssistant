let stepCount = 1;

document.getElementById('addIngredientButton1').addEventListener('click', handleAddIngredientClick);

document.getElementById('addStepButton').addEventListener('click', function () {
    stepCount++;
    const newStep = document.querySelector('.step').cloneNode(true);

    // Update the ID of the new step and its child elements
    newStep.id = 'step' + stepCount;
    const instructions = newStep.querySelector('textarea');
    instructions.id = 'recipestep' + stepCount;
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