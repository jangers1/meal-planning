import WeekPlan from './WeekPlan';
import WeekPlanToolbar from './WeekPlanToolbar';
import RecipeContainer from './RecipeContainer';
import FloatingActionButtons from './FloatingActionButtons';
import CreateGenericRecipeDialog from './CreateGenericRecipeDialog';
import type {DragEndEvent, DragStartEvent} from '@dnd-kit/core';
import {DndContext} from '@dnd-kit/core';
import {DragOverlay, useDragSensors} from '../../../../shared/dnd';
import {useCallback, useMemo, useState} from 'react';
import type {GenericRecipe, PrepedMeal, Recipe, RecipeItem} from '../../types/recipe.types';
import {useMealPlanState} from '../../hooks/useMealPlanState';
import RecipeCardPlan from './RecipeCard';
import {DeleteModeProvider} from '../../../../shared/components/ui/DeleteModeProvider';
import '../../../../shared/dnd/styles.css';

interface WeekPlanTabProps {
    genericRecipes: GenericRecipe[];
    prepedMeals: PrepedMeal[];
    recipes: Recipe[];
    isLoading: boolean;
    onCreateGeneric: (name: string) => void;
    onDeleteGeneric: (id: number) => void;
}

export default function WeekPlanTab({
                                        genericRecipes,
                                        prepedMeals,
                                        recipes,
                                        isLoading,
                                        onCreateGeneric,
                                        onDeleteGeneric,
                                    }: WeekPlanTabProps) {
    const [includeWeekend, setIncludeWeekend] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Meal plan state management
    const {
        getRecipeInSlot,
        assignRecipeToSlot,
        clearAllSlots,
        removeRecipeFromSlot,
        slotAssignments,
        clearWeekendSlots,
        getRecipeUsageCount,
    } = useMealPlanState();

    // Check if any slots have recipes
    const hasRecipesInSlots = useMemo(() => {
        return slotAssignments.size > 0;
    }, [slotAssignments]);

    // Get all recipes for lookup
    const allRecipes = useMemo<RecipeItem[]>(() => {
        return [...genericRecipes, ...prepedMeals, ...recipes];
    }, [genericRecipes, prepedMeals, recipes]);

    // Use smart sensor that checks each draggable's isInSlot data
    const sensors = useDragSensors();

    // Get recipe from draggable ID
    const getRecipeFromId = useCallback((id: string): RecipeItem | undefined => {
        let recipeId: number;

        // Check if ID is from a slot (slot-{slotId}-recipe-{recipeId})
        if (id.startsWith('slot-')) {
            const match = id.match(/^slot-.+-recipe-(\d+)$/);
            if (!match) return undefined;
            recipeId = parseInt(match[1]);
        } else {
            // ID is from container (recipe-{recipeId})
            recipeId = parseInt(id.replace('recipe-', ''));
        }

        return allRecipes.find(r => r.id === recipeId);
    }, [allRecipes]);

    const activeRecipe = useMemo(() => {
        if (!activeId) return null;
        return getRecipeFromId(activeId);
    }, [activeId, getRecipeFromId]);

    const handleCreateGenericClick = useCallback(() => {
        setShowCreateDialog(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setShowCreateDialog(false);
    }, []);

    const handleCreateGeneric = useCallback(
        (name: string) => {
            onCreateGeneric(name);
        },
        [onCreateGeneric]
    );

    const handleExportShoppingList = useCallback(() => {
        // TODO: Implement export logic
    }, []);

    const handleSave = useCallback(() => {
        // TODO: Implement save logic
    }, []);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const {active, over} = event;

        const activeIdStr = active.id as string;

        // Check if we're dragging from a slot (ID format: slot-{slotId}-recipe-{recipeId})
        const isFromSlot = activeIdStr.startsWith('slot-');
        let recipeId: number;
        let sourceSlotId: string | undefined;

        if (isFromSlot) {
            // Parse slot-based draggable ID: slot-{slotId}-recipe-{recipeId}
            const match = activeIdStr.match(/^slot-(.+)-recipe-(\d+)$/);
            if (!match) {
                setActiveId(null);
                return;
            }
            sourceSlotId = match[1];
            recipeId = parseInt(match[2]);
        } else {
            // Parse container-based draggable ID: recipe-{recipeId}
            recipeId = parseInt(activeIdStr.replace('recipe-', ''));
        }

        const recipe = allRecipes.find(r => r.id === recipeId);

        if (!recipe) {
            setActiveId(null);
            return;
        }

        if (over) {
            const overId = over.id as string;

            // Check if dropping on a meal slot
            if (overId.includes('-') && !overId.startsWith('recipe-') && !overId.startsWith('slot-')) {
                if (isFromSlot && sourceSlotId) {
                    // Moving from one slot to another
                    if (sourceSlotId !== overId) {
                        // Remove from source slot and add to target slot
                        removeRecipeFromSlot(sourceSlotId);
                        assignRecipeToSlot(overId, recipe);
                    }
                    // If same slot, do nothing (dropped on itself)
                } else {
                    // Cloning from container to slot
                    assignRecipeToSlot(overId, recipe);
                }
            }
            // If dropping back on container or non-slot area, handle appropriately
            else if (isFromSlot && sourceSlotId) {
                // Dragging from slot to non-slot area - remove from slot
                removeRecipeFromSlot(sourceSlotId);
            }
            // If from container to container, do nothing (it stays in container)
        } else {
            // Dropped outside any droppable zone
            if (isFromSlot && sourceSlotId) {
                // Remove from slot if dragged outside
                removeRecipeFromSlot(sourceSlotId);
            }
        }

        setActiveId(null);
    }, [allRecipes, assignRecipeToSlot, removeRecipeFromSlot]);

    const handleDragCancel = useCallback(() => {
        setActiveId(null);
    }, []);

    const handleToggleWeekend = useCallback((value: boolean) => {
        setIncludeWeekend(value);
        // Clear weekend slots when toggling weekend off
        if (!value) {
            clearWeekendSlots();
        }
    }, [clearWeekendSlots]);

    const defaultRecipeName = `Generic Recipe ${genericRecipes.length + 1}`;

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <DeleteModeProvider>
                <WeekPlan
                    includeWeekend={includeWeekend}
                    getRecipeInSlot={getRecipeInSlot}
                    onRemoveFromSlot={removeRecipeFromSlot}
                />

                <WeekPlanToolbar
                    includeWeekend={includeWeekend}
                    onToggleWeekend={handleToggleWeekend}
                    onCreateGeneric={handleCreateGenericClick}
                    onClearAll={clearAllSlots}
                    hasRecipesInSlots={hasRecipesInSlots}
                />
            </DeleteModeProvider>

            <RecipeContainer
                genericRecipes={genericRecipes}
                prepedMeals={prepedMeals}
                recipes={recipes}
                isLoading={isLoading}
                onDeleteGeneric={onDeleteGeneric}
                getRecipeUsageCount={getRecipeUsageCount}
            />

            <FloatingActionButtons
                onExportShoppingList={handleExportShoppingList}
                onSave={handleSave}
            />

            <CreateGenericRecipeDialog
                open={showCreateDialog}
                onClose={handleCloseDialog}
                onCreate={handleCreateGeneric}
                defaultName={defaultRecipeName}
            />

            <DragOverlay>
                {activeRecipe ? <RecipeCardPlan title={activeRecipe.title}/> : null}
            </DragOverlay>
        </DndContext>
    );
}