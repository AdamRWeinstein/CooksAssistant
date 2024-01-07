const USER_TEST_ID = "123456789012345678901234"; //TODO Remove USER_TEST_ID

const MEASUREMENT_UNITS = [
    'tsp',   // teaspoon
    'tbsp',  // tablespoon
    'cup',   // cup
    'g',     // gram
    'oz',    // ounce
    'lb',    // pound
    'unit',  
    'pinch'
];

if (typeof module !== 'undefined') {
    // Node.js environment
    module.exports = {
        USER_TEST_ID, //TODO Remove USER_TEST_ID export
        MEASUREMENT_UNITS
    };
} else {
    // Browser environment
    window.MEASUREMENT_UNITS = MEASUREMENT_UNITS;
}