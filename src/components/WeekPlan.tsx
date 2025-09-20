import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

export default function WeekPlan() {
    return (
        <Box sx={{
            width: 'min-content',
            overflowX: 'auto',
            padding: 2,
            backgroundColor: 'var(--primary-color)',
            borderRadius: 'var(--border-radius)'
        }}>
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    minWidth: 'fit-content',
                    justifyContent: 'center'
                }}
            >
                {DAYS_OF_WEEK.map((day) => (
                    <Box
                        key={day}
                        sx={{
                            padding: 2,
                            borderRadius: 'var(--border-radius)',
                            backgroundColor: 'var(--secondary-color)',
                            border: '1px solid var(--surface-dark)',
                            minWidth: '200px',
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
            </Stack>
        </Box>
    );
}
