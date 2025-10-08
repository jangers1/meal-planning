import {useState, useCallback} from 'react';
import type {RecipeItem} from '../types/recipe.types';

export interface MealSlotAssignment {
    slotId: string;
    recipe: RecipeItem;
}

interface UseMealPlanStateReturn {
    // State
    slotAssignments: Map<string, RecipeItem>;

    // Operations
    assignRecipeToSlot: (slotId: string, recipe: RecipeItem) => void;
    removeRecipeFromSlot: (slotId: string) => void;
    getRecipeInSlot: (slotId: string) => RecipeItem | undefined;
    isSlotOccupied: (slotId: string) => boolean;
    getSlotForRecipe: (recipeId: number) => string | undefined;
    clearAllSlots: () => void;
    clearWeekendSlots: () => void;
}

/**
 * Hook to manage meal plan slot assignments
 * Tracks which recipes are assigned to which meal slots
 */
export function useMealPlanState(): UseMealPlanStateReturn {
    const [slotAssignments, setSlotAssignments] = useState<Map<string, RecipeItem>>(new Map());

    const assignRecipeToSlot = useCallback((slotId: string, recipe: RecipeItem) => {
        setSlotAssignments(prev => {
            const next = new Map(prev);
            // Remove recipe from any existing slot
            for (const [existingSlotId, existingRecipe] of prev.entries()) {
                if (existingRecipe.id === recipe.id) {
                    next.delete(existingSlotId);
                }
            }
            // Assign to new slot
            next.set(slotId, recipe);
            return next;
        });
    }, []);

    const removeRecipeFromSlot = useCallback((slotId: string) => {
        setSlotAssignments(prev => {
            const next = new Map(prev);
            next.delete(slotId);
            return next;
        });
    }, []);

    const getRecipeInSlot = useCallback((slotId: string): RecipeItem | undefined => {
        return slotAssignments.get(slotId);
    }, [slotAssignments]);

    const isSlotOccupied = useCallback((slotId: string): boolean => {
        return slotAssignments.has(slotId);
    }, [slotAssignments]);

    const getSlotForRecipe = useCallback((recipeId: number): string | undefined => {
        for (const [slotId, recipe] of slotAssignments.entries()) {
            if (recipe.id === recipeId) {
                return slotId;
            }
        }
        return undefined;
    }, [slotAssignments]);

    const clearAllSlots = useCallback(() => {
        setSlotAssignments(new Map());
    }, []);

    const clearWeekendSlots = useCallback(() => {
        setSlotAssignments(prev => {
            const next = new Map(prev);
            // Remove all Saturday and Sunday slots
            for (const slotId of prev.keys()) {
                if (slotId.startsWith('Saturday-') || slotId.startsWith('Sunday-')) {
                    next.delete(slotId);
                }
            }
            return next;
        });
    }, []);

    return {
        slotAssignments,
        assignRecipeToSlot,
        removeRecipeFromSlot,
        getRecipeInSlot,
        isSlotOccupied,
        getSlotForRecipe,
        clearAllSlots,
        clearWeekendSlots,
    };
}
