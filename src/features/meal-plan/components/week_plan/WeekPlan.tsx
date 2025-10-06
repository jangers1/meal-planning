import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import {ALL_DAYS, WEEKDAYS_ONLY, MEAL_TYPES} from '../../constants';

interface WeekPlanProps {
    includeWeekend: boolean;
}

export default function WeekPlan({includeWeekend}: WeekPlanProps) {
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
                        {MEAL_TYPES.map((mealType) => (
                            <Box
                                key={`${day}-${mealType}`}
                                sx={{
                                    textAlign: 'center',
                                    color: 'rgba(0, 0, 0, 0.2)',
                                    padding: 1,
                                    borderRadius: 'var(--border-radius)',
                                    minHeight: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'var(--secondary-color)',
                                    fontSize: '14px',
                                    fontWeight: 900,
                                    boxShadow: `
                                            inset -1px -1px 4px #ffffffb2,
                                            inset 1px 1px 4px rgba(94, 104, 121, 0.945); 
                                        `
                                }}
                            >
                                {mealType}
                            </Box>
                        ))}
                    </Stack>
                </Box>
            ))}
        </Box>
    );
}
