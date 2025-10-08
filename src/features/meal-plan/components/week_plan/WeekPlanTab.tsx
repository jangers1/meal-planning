import WeekPlan from './WeekPlan';
import WeekPlanToolbar from './WeekPlanToolbar';
import RecipeContainer from './RecipeContainer';
import FloatingActionButtons from './FloatingActionButtons';
import CreateGenericRecipeDialog from './CreateGenericRecipeDialog';
import type {DragEndEvent, DragStartEvent} from '@dnd-kit/core';
import {DndContext} from '@dnd-kit/core';
import {DragOverlay, useDragSensors} from '../../../../shared/dnd';
import {useCallback, useMemo, useState} from 'react';
import type {GenericRecipe, Recipe, RecipeItem} from '../../types/recipe.types';
import {useMealPlanState} from '../../hooks/useMealPlanState';
import RecipeCardPlan from './RecipeCard';
import {DeleteModeProvider} from '../../../../shared/components/ui/DeleteModeProvider';
import '../../../../shared/dnd/styles.css';

interface WeekPlanTabProps {
    genericRecipes: GenericRecipe[];
    recipes: Recipe[];
    onCreateGeneric: (name: string) => void;
    onDeleteGeneric: (id: number) => void;
}

export default function WeekPlanTab({
                                        genericRecipes,
                                        recipes,
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
        getSlotForRecipe,
        clearAllSlots,
        removeRecipeFromSlot,
        slotAssignments,
        clearWeekendSlots,
    } = useMealPlanState();

    // Check if any slots have recipes
    const hasRecipesInSlots = useMemo(() => {
        return slotAssignments.size > 0;
    }, [slotAssignments]);

    // Get all recipes for lookup
    const allRecipes = useMemo<RecipeItem[]>(() => {
        return [...genericRecipes, ...recipes];
    }, [genericRecipes, recipes]);

    // Use smart sensor that checks each draggable's isInSlot data
    const sensors = useDragSensors();

    // Get recipe from draggable ID
    const getRecipeFromId = useCallback((id: string): RecipeItem | undefined => {
        const recipeId = parseInt(id.replace('recipe-', ''));
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

        const recipeId = parseInt((active.id as string).replace('recipe-', ''));
        const recipe = allRecipes.find(r => r.id === recipeId);

        if (!recipe) {
            setActiveId(null);
            return;
        }

        // Get the current slot this recipe is in (if any)
        const currentSlot = getSlotForRecipe(recipe.id);

        if (over) {
            // Check if dropping on a slot (slot IDs contain a dash like "Monday-Breakfast")
            const overId = over.id as string;
            if (overId.includes('-') && !overId.startsWith('recipe-')) {
                // Dropping on a meal slot
                assignRecipeToSlot(overId, recipe);
            }
            // If dropping on anything else (like recipe container), do nothing
            // The recipe will automatically return to library because it's removed from slot
        } else if (currentSlot) {
            // Dropped outside any droppable zone while it was in a slot
            // Remove it from the slot (returns it to library)
            removeRecipeFromSlot(currentSlot);
        }

        setActiveId(null);
    }, [allRecipes, assignRecipeToSlot, getSlotForRecipe, removeRecipeFromSlot]);

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
                recipes={recipes}
                onDeleteGeneric={onDeleteGeneric}
                getSlotForRecipe={getSlotForRecipe}
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