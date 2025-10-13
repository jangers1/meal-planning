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
    return (
        <Badge
            badgeContent={usageCount || null}
            color="primary"
            size="lg"
            sx={{
                '& .MuiBadge-badge': {
                    minWidth: '24px',
                    height: '24px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                }
            }}
        >
            <Draggable id={`recipe-${recipe.id}`} isInSlot={false}>
                <RecipeCardPlan title={recipe.title} />
            </Draggable>
        </Badge>
    );
}
