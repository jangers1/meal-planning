import {Box, Divider, Select, Sheet, Typography} from "@mui/joy";
import Stack from "@mui/joy/Stack";

interface FilterPanelProps {
    isOpen: boolean;
    drawerWidth: string;
}

export function FilterPanel({isOpen, drawerWidth}: FilterPanelProps) {
    return (
        <Sheet
            component="aside"
            role="complementary"
            aria-label="Recipe filters"
            aria-hidden={!isOpen}
            sx={{
                width: isOpen ? drawerWidth : 0,
                transition: 'width 0.3s ease',
                overflow: 'hidden',
                borderLeft: isOpen ? '1px solid' : 'none',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                p: isOpen ? (theme) => theme.spacing(2, 0, 2, 2) : 0,
            }}
        >
            {isOpen && (
                <>
                    <Typography level="h2" textAlign={'center'}>Recipe Filters</Typography>
                    <Box>
                        <Typography level={'h4'}>Recipe Creator</Typography>
                        <Select sx={{mt: 1}} />
                    </Box>
                    <Box>
                        <Typography level={'h4'}>Tags</Typography>
                        <Stack direction={'column'} spacing={2} sx={{mt: 1}}>
                            <Box
                                sx={{
                                    minHeight: '50px',
                                    borderRadius: 5,
                                    backgroundColor: 'var(--joy-palette-neutral-softBg)',
                                    p: 2
                                }}
                            >
                                <Typography level={'body-sm'} sx={{opacity: 0.5}} textAlign={'center'}>
                                    Click on Tags below to select them. Recipes will begin to group themselves by selected tags
                                </Typography>
                            </Box>
                            <Divider/>
                            <Box
                                sx={{
                                    minHeight: '300px',
                                    borderRadius: 5,
                                    backgroundColor: 'var(--joy-palette-neutral-softBg)',
                                    p: 2
                                }}
                            />
                        </Stack>
                    </Box>
                </>
            )}
        </Sheet>
    );
}

