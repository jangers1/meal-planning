import {Box, Card, Stack, Typography} from '@mui/joy';

interface CalenderItemProps {
    date: number
    breakfast?: string
    lunch?: string
    dinner?: string
    isToday?: boolean
    isSelected?: boolean
    onClick?: () => void
}

function CalenderItem({date, breakfast, lunch, dinner, isToday, isSelected, onClick}: CalenderItemProps) {
    return (
        <>
            <Card
                onClick={onClick}
                sx={{
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'row',
                    p: 1,
                    cursor: 'pointer',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: (isToday || isSelected) ? '2px solid' : 'none',
                        borderColor: (isToday || isSelected) ? 'primary.500' : 'transparent',
                    }}
                >
                    <Typography level={'body-lg'}>
                        {date}
                    </Typography>
                </Box>
                <Stack
                    direction={'column'}
                    spacing={0.5}
                    sx={{
                        display: 'flex',
                        flexGrow: 1,
                    }}
                >
                    <Box
                        sx={{
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255,208,0,0.5)',
                            flexGrow: 1,
                            padding: '2px 4px'
                        }}
                    >
                        <Typography level={'body-sm'}>
                            Test Brek
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255,0,0,0.5)',
                            flexGrow: 1,
                            padding: '2px 4px'
                        }}
                    >
                        <Typography level={'body-sm'}>
                            Test Lunch
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            borderRadius: '4px',
                            backgroundColor: 'rgba(35,255,0,0.5)',
                            flexGrow: 1,
                            padding: '2px 4px'
                        }}
                    >
                        <Typography level={'body-sm'}>
                            Test Dins
                        </Typography>
                    </Box>
                </Stack>
            </Card>
        </>
    )
}

export default CalenderItem;