import {Draggable} from '../../../../shared/dnd';
import type {RecipeItem} from '../../types/recipe.types';
import RecipeCardPlan from './RecipeCard';
import {Badge} from '@mui/joy';

interface DraggableRecipeCardProps {
    recipe: RecipeItem;
    usageCount?: number;
}

/**
 * Draggable wrapper for recipe cards
 * Handles drag logic and visual feedback
 */
export default function DraggableRecipeCard({recipe, usageCount = 0}: DraggableRecipeCardProps) {
    // For prepped meals, show remaining quantity (countdown)
    // For other recipes, show usage count (count up)
    const badgeCount = recipe.type === 'prepped'
        ? Math.max(0, recipe.quantity - usageCount)  // Countdown: show remaining
        : usageCount;  // Count up: show how many times used

    return (
        <Badge
            badgeContent={badgeCount || null}
            color="primary"
            size="lg"
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                '& .MuiBadge-badge': {
                    minWidth: '24px',
                    height: '24px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                }
            }}
        >
            <Draggable id={`recipe-${recipe.id}`} isInSlot={false}>
                <RecipeCardPlan title={recipe.title}/>
            </Draggable>
        </Badge>
    );
}
