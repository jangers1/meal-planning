import { useState, useCallback } from 'react';
import { GenericRecipe, Recipe, RecipeItem } from '../types/recipe.types';

// Mock data for regular recipes - this could later be replaced with API calls
const INITIAL_RECIPES: Recipe[] = [
    { id: 1, title: 'Spaghetti Bolognese', type: 'recipe' },
    { id: 2, title: 'Chicken Curry', type: 'recipe' },
    { id: 3, title: 'Beef Stroganoff', type: 'recipe' },
    { id: 4, title: 'Vegetable Stir Fry', type: 'recipe' },
    { id: 5, title: 'Fish Tacos', type: 'recipe' },
    { id: 6, title: 'Lentil Soup', type: 'recipe' },
    { id: 7, title: 'Caesar Salad', type: 'recipe' },
    { id: 8, title: 'Pancakes', type: 'recipe' },
];

interface UseRecipeManagerReturn {
    // State
    genericRecipes: GenericRecipe[];
    recipes: Recipe[];

    // Generic recipe operations
    createGenericRecipe: (title: string) => void;
    deleteGenericRecipe: (id: number) => void;
    updateGenericRecipe: (id: number, updates: Partial<GenericRecipe>) => void;

    // Regular recipe operations
    deleteRecipe: (id: number) => void;
    updateRecipe: (id: number, updates: Partial<Recipe>) => void;

    // Combined operations
    getAllRecipes: () => RecipeItem[];
    getRecipeById: (id: number) => RecipeItem | undefined;
}

const useRecipeManager = (): UseRecipeManagerReturn => {
    const [genericRecipes, setGenericRecipes] = useState<GenericRecipe[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);

    // Generic recipe operations
    const createGenericRecipe = useCallback((title: string) => {
        const newRecipe: GenericRecipe = {
            id: Date.now(),
            title: title.trim(),
            type: 'generic'
        };
        setGenericRecipes(prev => [...prev, newRecipe]);
    }, []);

    const deleteGenericRecipe = useCallback((id: number) => {
        setGenericRecipes(prev => prev.filter(recipe => recipe.id !== id));
    }, []);

    const updateGenericRecipe = useCallback((id: number, updates: Partial<GenericRecipe>) => {
        setGenericRecipes(prev =>
            prev.map(recipe =>
                recipe.id === id ? { ...recipe, ...updates } : recipe
            )
        );
    }, []);

    // Regular recipe operations
    const deleteRecipe = useCallback((id: number) => {
        setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    }, []);

    const updateRecipe = useCallback((id: number, updates: Partial<Recipe>) => {
        setRecipes(prev =>
            prev.map(recipe =>
                recipe.id === id ? { ...recipe, ...updates } : recipe
            )
        );
    }, []);

    // Combined operations
    const getAllRecipes = useCallback((): RecipeItem[] => {
        return [...genericRecipes, ...recipes];
    }, [genericRecipes, recipes]);

    const getRecipeById = useCallback((id: number): RecipeItem | undefined => {
        return getAllRecipes().find(recipe => recipe.id === id);
    }, [getAllRecipes]);

    return {
        // State
        genericRecipes,
        recipes,

        // Generic recipe operations
        createGenericRecipe,
        deleteGenericRecipe,
        updateGenericRecipe,

        // Regular recipe operations
        deleteRecipe,
        updateRecipe,

        // Combined operations
        getAllRecipes,
        getRecipeById,
    };
};

export default useRecipeManager;
