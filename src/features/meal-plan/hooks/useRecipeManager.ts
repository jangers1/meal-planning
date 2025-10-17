import {useCallback, useEffect, useState} from 'react';
import type {GenericRecipe, PreppedMeal, Recipe, RecipeItem} from '../types/recipe.types';

// Mock data for regular recipes - this could later be replaced with API calls
const INITIAL_RECIPES: Recipe[] = [
    {id: 1, title: 'Spaghetti Bolognese', type: 'recipe'},
    {id: 2, title: 'Chicken Curry', type: 'recipe'},
    {id: 3, title: 'Beef Stroganoff', type: 'recipe'},
    {id: 4, title: 'Vegetable Stir Fry', type: 'recipe'},
    {id: 5, title: 'Fish Tacos', type: 'recipe'},
    {id: 6, title: 'Lentil Soup', type: 'recipe'},
    {id: 7, title: 'Caesar Salad', type: 'recipe'},
    {id: 8, title: 'Pancakes', type: 'recipe'},
];

const EXAMPLE_PREPPED_MEALS: PreppedMeal[] = [
    {id: 101, title: 'Grilled Chicken Breast', type: 'prepped'},
    {id: 102, title: 'Roasted Vegetables', type: 'prepped'},
];

interface UseRecipeManagerReturn {
    // State
    genericRecipes: GenericRecipe[];
    preppedMeals: PreppedMeal[];
    recipes: Recipe[];
    isLoading: boolean;

    // Generic recipe operations
    createGenericRecipe: (title: string) => void;
    deleteGenericRecipe: (id: number) => void;
    updateGenericRecipe: (id: number, updates: Partial<GenericRecipe>) => void;

    // Prepped meal operations
    createPreppedMeal: (title: string) => void;
    deletePreppedMeal: (id: number) => void;
    updatePreppedMeal: (id: number, updates: Partial<PreppedMeal>) => void;

    // Regular recipe operations
    deleteRecipe: (id: number) => void;
    updateRecipe: (id: number, updates: Partial<Recipe>) => void;

    // Combined operations
    getAllRecipes: () => RecipeItem[];
    getRecipeById: (id: number) => RecipeItem | undefined;
}

const useRecipeManager = (): UseRecipeManagerReturn => {
    const [genericRecipes, setGenericRecipes] = useState<GenericRecipe[]>([]);
    const [preppedMeals, setPreppedMeals] = useState<PreppedMeal[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading recipes (replace with actual API call)
    useEffect(() => {
        const timer = setTimeout(() => {
            setRecipes(INITIAL_RECIPES);
            setPreppedMeals(EXAMPLE_PREPPED_MEALS);
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

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
                recipe.id === id ? {...recipe, ...updates} : recipe
            )
        );
    }, []);

    // Prepped meal operations
    const createPreppedMeal = useCallback((title: string) => {
        const newMeal: PreppedMeal = {
            id: Date.now(),
            title: title.trim(),
            type: 'prepped'
        };
        setPreppedMeals(prev => [...prev, newMeal]);
    }, []);

    const deletePreppedMeal = useCallback((id: number) => {
        setPreppedMeals(prev => prev.filter(meal => meal.id !== id));
    }, []);

    const updatePreppedMeal = useCallback((id: number, updates: Partial<PreppedMeal>) => {
        setPreppedMeals(prev =>
            prev.map(meal =>
                meal.id === id ? {...meal, ...updates} : meal
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
                recipe.id === id ? {...recipe, ...updates} : recipe
            )
        );
    }, []);

    // Combined operations
    const getAllRecipes = useCallback((): RecipeItem[] => {
        return [...genericRecipes, ...preppedMeals, ...recipes];
    }, [genericRecipes, preppedMeals, recipes]);

    const getRecipeById = useCallback((id: number): RecipeItem | undefined => {
        return getAllRecipes().find(recipe => recipe.id === id);
    }, [getAllRecipes]);

    return {
        // State
        genericRecipes,
        preppedMeals,
        recipes,
        isLoading,

        // Generic recipe operations
        createGenericRecipe,
        deleteGenericRecipe,
        updateGenericRecipe,

        // Prepped meal operations
        createPreppedMeal,
        deletePreppedMeal,
        updatePreppedMeal,

        // Regular recipe operations
        deleteRecipe,
        updateRecipe,

        // Combined operations
        getAllRecipes,
        getRecipeById,
    };
};

export default useRecipeManager;
