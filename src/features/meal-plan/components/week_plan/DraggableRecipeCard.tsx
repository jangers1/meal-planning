import {Draggable} from '../../../../shared/dnd';
import type {RecipeItem} from '../../types/recipe.types';
import RecipeCardPlan from './RecipeCard';

interface DraggableRecipeCardProps {
    recipe: RecipeItem;
}

/**
 * Draggable wrapper for recipe cards
 * Handles drag logic and visual feedback
 */
export default function DraggableRecipeCard({recipe}: DraggableRecipeCardProps) {
    return (
        <Draggable id={`recipe-${recipe.id}`} isInSlot={false}>
            <RecipeCardPlan title={recipe.title} />
        </Draggable>
    );
}
