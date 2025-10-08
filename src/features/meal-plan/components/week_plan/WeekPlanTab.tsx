import WeekPlan from './WeekPlan';
import WeekPlanToolbar from './WeekPlanToolbar';
import RecipeContainer from './RecipeContainer';
import FloatingActionButtons from './FloatingActionButtons';
import CreateGenericRecipeDialog from './CreateGenericRecipeDialog';
import type {DragEndEvent, DragStartEvent, DragOverEvent} from '@dnd-kit/core';
import {DndContext} from '@dnd-kit/core';
import {DragOverlay, useDragSensors} from '../../../../shared/dnd';
import {useCallback, useMemo, useState} from 'react';
import type {GenericRecipe, Recipe, RecipeItem} from '../../types/recipe.types';
import {useMealPlanState} from '../../hooks/useMealPlanState';
import RecipeCardPlan from './RecipeCard';
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
    const [overlaySize, setOverlaySize] = useState<{width: number | undefined; height: number | undefined}>({width: undefined, height: undefined});
    const [initialOverlayWidth, setInitialOverlayWidth] = useState<number | undefined>(undefined);

    // Meal plan state management
    const {
        getRecipeInSlot,
        assignRecipeToSlot,
        getSlotForRecipe,
        clearAllSlots,
        removeRecipeFromSlot,
    } = useMealPlanState();

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
        console.log('Shopping List Exported');
        // TODO: Implement export logic
    }, []);

    const handleSave = useCallback(() => {
        console.log('Meal Plan Saved');
        // TODO: Implement save logic
    }, []);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const idStr = String(event.active.id);
        // Debug log start
        if (typeof window !== 'undefined') {
            // eslint-disable-next-line no-console
            console.log('[DND] drag start for', idStr);
        }
        setActiveId(event.active.id as string);

        // Measure size of the active element to lock overlay dimensions
        const node = document.querySelector(`[data-dnd-id="${idStr}"]`) as HTMLElement | null;
        if (node) {
            const rect = node.getBoundingClientRect();
            const size = {
                width: rect.width > 0 ? rect.width : undefined,
                height: rect.height > 0 ? rect.height : undefined,
            };
            setOverlaySize(size);
            setInitialOverlayWidth(size.width);
            if (typeof window !== 'undefined') {
                // eslint-disable-next-line no-console
                console.log('[DND] measured node rect', size);
            }
            return;
        }
        if (typeof window !== 'undefined') {
            // eslint-disable-next-line no-console
            console.warn('[DND] node not found for id', idStr);
        }

        // Fallback: try limited info from event
        const anyActive = event.active as unknown as {
            node?: HTMLElement;
            rect?: { current?: { translated?: DOMRect | {width?: number; height?: number}; initial?: DOMRect | {width?: number; height?: number} } };
        };
        const fromRect = anyActive?.rect?.current?.translated || anyActive?.rect?.current?.initial;
        const measuredWidth = (fromRect as DOMRect)?.width ?? anyActive?.node?.offsetWidth;
        const measuredHeight = (fromRect as DOMRect)?.height ?? anyActive?.node?.offsetHeight;

        const size = {
            width: typeof measuredWidth === 'number' && measuredWidth > 0 ? measuredWidth : undefined,
            height: typeof measuredHeight === 'number' && measuredHeight > 0 ? measuredHeight : undefined,
        };
        setOverlaySize(size);
        setInitialOverlayWidth(size.width);
        if (typeof window !== 'undefined') {
            // eslint-disable-next-line no-console
            console.log('[DND] measured fallback size', size);
        }
    }, []);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        const overId = event.over?.id as string | undefined;
        if (!overId) return;
        // Detect slot droppables: IDs contain '-' and not recipe-
        const isSlot = overId.includes('-') && !overId.startsWith('recipe-');
        if (isSlot) {
            const slotNode = document.querySelector(`[data-droppable-id="${overId}"]`) as HTMLElement | null;
            if (slotNode) {
                const rect = slotNode.getBoundingClientRect();
                const newWidth = rect.width > 0 ? rect.width : undefined;
                if (newWidth && newWidth !== overlaySize.width) {
                    setOverlaySize(prev => ({...prev, width: newWidth}));
                    if (typeof window !== 'undefined') {
                        // eslint-disable-next-line no-console
                        console.log('[DND] adjusted overlay width to slot', newWidth);
                    }
                }
                return;
            }
        }
        // Not over slot: revert to initial overlay width if it exists
        if (initialOverlayWidth && initialOverlayWidth !== overlaySize.width) {
            setOverlaySize(prev => ({...prev, width: initialOverlayWidth}));
            if (typeof window !== 'undefined') {
                // eslint-disable-next-line no-console
                console.log('[DND] reverted overlay width', initialOverlayWidth);
            }
        }
    }, [initialOverlayWidth, overlaySize.width]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const {active, over} = event;

        const recipeId = parseInt((active.id as string).replace('recipe-', ''));
        const recipe = allRecipes.find(r => r.id === recipeId);

        if (!recipe) {
            setActiveId(null);
            setOverlaySize({width: undefined, height: undefined});
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
        setOverlaySize({width: undefined, height: undefined});
    }, [allRecipes, assignRecipeToSlot, getSlotForRecipe, removeRecipeFromSlot]);

    const handleDragCancel = useCallback(() => {
        setActiveId(null);
        setOverlaySize({width: undefined, height: undefined});
    }, []);

    const defaultRecipeName = `Generic Recipe ${genericRecipes.length + 1}`;

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <WeekPlan
                includeWeekend={includeWeekend}
                getRecipeInSlot={getRecipeInSlot}
            />

            <WeekPlanToolbar
                includeWeekend={includeWeekend}
                onToggleWeekend={setIncludeWeekend}
                onCreateGeneric={handleCreateGenericClick}
                onClearAll={clearAllSlots}
            />

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

            <DragOverlay width={overlaySize.width} height={overlaySize.height}>
                {activeRecipe ? <RecipeCardPlan title={activeRecipe.title}/> : null}
            </DragOverlay>
        </DndContext>
    );
}