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
        MEASUREMENT_UNITS
    };
} else {
    // Browser environment
    window.MEASUREMENT_UNITS = MEASUREMENT_UNITS;
}