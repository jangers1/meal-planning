import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import {ALL_DAYS, WEEKDAYS_ONLY, MEAL_TYPES, createSlotId} from '../../constants';
import MealSlot from './MealSlot';
import type {RecipeItem} from '../../types/recipe.types';

interface WeekPlanProps {
    includeWeekend: boolean;
    getRecipeInSlot: (slotId: string) => RecipeItem | undefined;
}

export default function WeekPlan({includeWeekend, getRecipeInSlot}: WeekPlanProps) {
    const daysToShow = includeWeekend ? ALL_DAYS : WEEKDAYS_ONLY;

    return (
        <Box sx={{
            mt: 2,
            overflowX: 'auto',
            padding: 2,
            backgroundColor: 'var(--primary-color)',
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
                        backgroundColor: 'var(--secondary-color)',
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
                                />
                            );
                        })}
                    </Stack>
                </Box>
            ))}
        </Box>
    );
}
