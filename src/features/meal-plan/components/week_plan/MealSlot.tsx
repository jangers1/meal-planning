import {Box} from '@mui/joy';
import {Draggable, Droppable} from '../../../../shared/dnd';
import {createSlotId} from '../../constants';
import type {RecipeItem} from '../../types/recipe.types';
import RecipeCardPlan from './RecipeCard';
import {DeletableItem} from '../../../../shared/components/ui/DeleteModeProvider';

interface MealSlotProps {
    day: string;
    mealType: string;
    recipe?: RecipeItem;
    isDeleteMode: boolean;
    onRemoveFromSlot: () => void;
}

export default function MealSlot({day, mealType, recipe, isDeleteMode, onRemoveFromSlot}: MealSlotProps) {
    const slotId = createSlotId(day, mealType);
    // Create a unique draggable ID for the recipe in this specific slot
    const draggableId = recipe ? `slot-${slotId}-recipe-${recipe.id}` : '';

    return (
        <Droppable id={slotId} className="meal-slot-droppable">
            {(isOver) => (
                <Box
                    sx={{
                        textAlign: 'center',
                        color: recipe ? 'inherit' : 'rgba(0, 0, 0, 0.2)',
                        // Add padding to create visual space between slot edge and content
                        padding: recipe ? '6px' : 1,
                        borderRadius: 'var(--border-radius)',
                        minHeight: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isOver ? 'rgba(76, 175, 80, 0.2)' : 'var(--secondary-color)',
                        fontSize: '14px',
                        fontWeight: recipe ? 400 : 900,
                        boxShadow: `
                            inset -1px -1px 4px #ffffffb2,
                            inset 1px 1px 4px rgba(94, 104, 121, 0.945); 
                        `,
                        // Ensure box sizing includes padding
                        boxSizing: 'border-box',
                        // Fill the droppable zone completely
                        width: '100%',
                        // Add dotted border when hovering
                        transition: 'background-color 120ms ease-out',
                        '&:hover': {
                            // Bring the corners in on hover
                            '--_s': '0px',
                        },
                        '@media (prefers-reduced-motion: reduce)': {
                            transition: 'none',
                            '&::before': {
                                transition: 'none',
                            },
                        },
                    }}
                >
                    {recipe ? (
                        isDeleteMode ? (
                            <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <DeletableItem
                                    itemId={recipe.id}
                                    onDelete={onRemoveFromSlot}
                                    requireConfirmation={false}
                                >
                                    <Draggable id={draggableId} isInSlot={true}>
                                        <RecipeCardPlan title={recipe.title}/>
                                    </Draggable>
                                </DeletableItem>
                            </Box>
                        ) : (
                            <Draggable id={draggableId} isInSlot={true}>
                                <RecipeCardPlan title={recipe.title}/>
                            </Draggable>
                        )
                    ) : (
                        mealType
                    )}
                </Box>
            )}
        </Droppable>
    );
}