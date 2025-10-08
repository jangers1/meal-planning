import {Box} from '@mui/joy';
import {Draggable, Droppable} from '../../../../shared/dnd';
import {createSlotId} from '../../constants';
import type {RecipeItem} from '../../types/recipe.types';
import RecipeCardPlan from './RecipeCard';

interface MealSlotProps {
    day: string;
    mealType: string;
    recipe?: RecipeItem;
}

export default function MealSlot({day, mealType, recipe}: MealSlotProps) {
    const slotId = createSlotId(day, mealType);

    return (
        <Droppable id={slotId} className="meal-slot-droppable">
            <Box
                sx={{
                    textAlign: 'center',
                    color: recipe ? 'inherit' : 'rgba(0, 0, 0, 0.2)',
                    padding: 1,
                    borderRadius: 'var(--border-radius)',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--secondary-color)',
                    fontSize: '14px',
                    fontWeight: recipe ? 400 : 900,
                    boxShadow: `
                        inset -1px -1px 4px #ffffffb2,
                        inset 1px 1px 4px rgba(94, 104, 121, 0.945); 
                    `,
                }}
            >
                {recipe ? (
                    <Draggable id={`recipe-${recipe.id}`} isInSlot={true}>
                        <RecipeCardPlan title={recipe.title}/>
                    </Draggable>
                ) : (
                    mealType
                )}
            </Box>
        </Droppable>
    );
}
