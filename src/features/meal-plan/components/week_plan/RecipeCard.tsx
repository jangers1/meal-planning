import {Box} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import { gradientGlowBorderStyle } from '../../../../shared/utils/cardStyles.ts';

interface RecipeCardPlanProps {
    title: string;
}

export default function RecipeCardPlan({title}: RecipeCardPlanProps) {
    return (
        <Box
            sx={{
                ...gradientGlowBorderStyle,
                p: 1,
                borderRadius: 'var(--border-radius)',
                height: 'fit-content',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
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
