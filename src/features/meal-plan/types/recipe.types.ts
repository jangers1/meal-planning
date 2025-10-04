// Base recipe interface that both generic and regular recipes extend
export interface BaseRecipe {
  id: number;
  title: string;
}

// Generic recipe - simple recipe with just title
export interface GenericRecipe extends BaseRecipe {
  type: 'generic';
}

// Regular recipe - could be extended with more properties later
export interface Recipe extends BaseRecipe {
  type: 'recipe';
  // Future properties like ingredients, instructions, etc. can be added here
}

// Union type for all recipe types
export type RecipeItem = GenericRecipe | Recipe;

// Props for recipe-related operations
export interface RecipeOperations {
  onDelete: (id: number) => void;
  onCreate: (title: string) => void;
  onUpdate?: (id: number, updates: Partial<BaseRecipe>) => void;
}
