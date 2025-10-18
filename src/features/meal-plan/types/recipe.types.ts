// Base recipe interface that both generic and regular recipes extend
export interface BaseRecipe {
    id: number;
    title: string;
}

// Generic recipe - simple recipe with just title
export interface GenericRecipe extends BaseRecipe {
    type: 'generic';
}

// Prepped meal - pre-cooked meals from fridge/freezer
export interface PreppedMeal extends BaseRecipe {
    type: 'prepped';
    quantity: number; // How many portions are available
}

// Regular recipe - could be extended with more properties later
export interface Recipe extends BaseRecipe {
    type: 'recipe';
    // Future properties like ingredients, instructions, etc. can be added here
}

// Union type for all recipe types
export type RecipeItem = GenericRecipe | PreppedMeal | Recipe;

// Props for recipe-related operations
