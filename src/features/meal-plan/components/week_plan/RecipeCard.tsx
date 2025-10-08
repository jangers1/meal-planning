import {Box} from "@mui/joy";
import Typography from "@mui/joy/Typography";

interface RecipeCardPlanProps {
    title: string;
}

export default function RecipeCardPlan({title}: RecipeCardPlanProps) {
    return (
        <Box
            sx={{
                backgroundColor: 'rgba(104,194,246,0.6)',
                p: 1,
                borderRadius: 'var(--border-radius)',
                border: '1px solid rgb(0,0,0)',
                height: 'fit-content',
                minHeight: '48px', // Reduced from 60px since slot padding handles spacing
                display: 'flex',
                alignItems: 'center',
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                position: 'relative',
                // Fill container width completely
                width: '100%',
                boxSizing: 'border-box',
            }}
        >
            <Typography
                level="body-lg"
                sx={{
                    textAlign: 'center',
                    lineHeight: 1.2,
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                }}
            >
                {title}
            </Typography>
        </Box>
    );
}
