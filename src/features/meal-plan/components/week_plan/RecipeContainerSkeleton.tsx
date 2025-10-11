import {Box, Skeleton} from "@mui/joy";

interface RecipeContainerSkeletonProps {
    count?: number;
}

export function RecipeContainerSkeleton({count = 8}: RecipeContainerSkeletonProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                backgroundColor: 'var(--primary-color)',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'inset 0 0 24px rgba(0, 0, 0, 0.1)',
                mt: 2,
                p: 2,
            }}
        >
            {/* Recipe grid skeleton - no header, just the grid */}
            <Box
                sx={{
                    mt: 1,
                    display: 'grid',
                    gridAutoRows: 'minmax(60px, auto)',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: 2,
                    alignContent: 'start',
                }}
            >
                {Array.from({length: count}).map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'md',
                            overflow: 'hidden',
                            bgcolor: 'background.surface',
                            p: 1,
                        }}
                    >
                        <Skeleton variant="text" level="body-md" width="80%" />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
