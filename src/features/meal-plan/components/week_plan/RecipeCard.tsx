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
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
            }}
        >
            <Typography
                level="body-lg"
                sx={{
                    lineHeight: 1.2,
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                }}
            >
                {title}
            </Typography>
        </Box>
    );
}
