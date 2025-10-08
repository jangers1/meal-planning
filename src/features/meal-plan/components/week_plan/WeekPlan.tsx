import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import {ALL_DAYS, createSlotId, MEAL_TYPES, WEEKDAYS_ONLY} from '../../constants';
import MealSlot from './MealSlot';
import type {RecipeItem} from '../../types/recipe.types';
import {useDeleteMode} from '../../../../shared/hooks/useDeleteMode';

interface WeekPlanProps {
    includeWeekend: boolean;
    getRecipeInSlot: (slotId: string) => RecipeItem | undefined;
    onRemoveFromSlot: (slotId: string) => void;
}

export default function WeekPlan({includeWeekend, getRecipeInSlot, onRemoveFromSlot}: WeekPlanProps) {
    const daysToShow = includeWeekend ? ALL_DAYS : WEEKDAYS_ONLY;
    const {isDeleteMode} = useDeleteMode();

    return (
        <Box sx={{
            mt: 2,
            mx: 3,
            overflowX: 'auto',
            padding: 2,
            backgroundColor: 'var(--joy-palette-neutral-softBg)',
            boxShadow: "9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.5)",
            borderRadius: 'var(--border-radius)',
            display: 'grid',
            gridTemplateColumns: `repeat(${daysToShow.length}, 1fr)`,
            gap: 2
        }}>
            {daysToShow.map((day) => (
                <Box
                    key={day}
                    sx={{
                        padding: 2,
                        borderRadius: 'var(--border-radius)',
                        backgroundColor: 'white',
                        boxShadow: "3px 3px 8px rgba(163, 177, 198, 0.6), -3px -3px 8px rgba(255, 255, 255, 0.5)",
                        border: '1px solid var(--surface-dark)',
                        minWidth: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    <Typography
                        level="h4"
                        sx={{
                            textAlign: 'center',
                            marginBottom: 1,
                            fontWeight: 600
                        }}
                    >
                        {day}
                    </Typography>
                    <Stack spacing={1}>
                        {MEAL_TYPES.map((mealType) => {
                            const slotId = createSlotId(day, mealType);
                            const recipe = getRecipeInSlot(slotId);

                            return (
                                <MealSlot
                                    key={slotId}
                                    day={day}
                                    mealType={mealType}
                                    recipe={recipe}
                                    isDeleteMode={isDeleteMode}
                                    onRemoveFromSlot={() => onRemoveFromSlot(slotId)}
                                />
                            );
                        })}
                    </Stack>
                </Box>
            ))}
        </Box>
    );
}
