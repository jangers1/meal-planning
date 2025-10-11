import {Box, Skeleton} from "@mui/joy";

interface RecipeGridSkeletonProps {
    count?: number;
}

export function RecipeGridSkeleton({count = 16}: RecipeGridSkeletonProps) {
    return (
        <Box
            sx={{
                flex: 1,
                borderRadius: 5,
                backgroundColor: 'var(--joy-palette-neutral-softBg)',
                mt: 1,
                position: 'relative',
                boxShadow: 'inset 0 0 24px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    p: 2,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gridAutoRows: '210px',
                    gap: 2,
                    borderRadius: 5
                }}
            >
                {Array.from({length: count}).map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            borderRadius: 'md',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            p: 2,
                            bgcolor: 'background.surface',
                            boxShadow: 'sm',
                        }}
                    >
                        {/* Recipe title skeleton */}
                        <Skeleton variant="text" level="h3" width="80%" />

                        {/* Recipe description skeleton */}
                        <Skeleton variant="text" level="body-sm" width="100%" />
                        <Skeleton variant="text" level="body-sm" width="90%" />

                        {/* Tags skeleton */}
                        <Box sx={{display: 'flex', gap: 0.5, mt: 'auto'}}>
                            <Skeleton variant="rectangular" width={60} height={24} sx={{borderRadius: 'sm'}} />
                            <Skeleton variant="rectangular" width={80} height={24} sx={{borderRadius: 'sm'}} />
                            <Skeleton variant="rectangular" width={70} height={24} sx={{borderRadius: 'sm'}} />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

