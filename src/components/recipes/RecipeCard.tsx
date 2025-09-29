import {Avatar, Card, Divider} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Chip from '@mui/joy/Chip';
import type {JoyColours} from '../../types.ts';

interface RecipeTag {
    tagName: string;
    color?: JoyColours;
}

interface RecipeCardProps {
    name: string;
    description: string;
    tags: RecipeTag[];
    link: string;
}

function RecipeCard({name, tags, link, description}: RecipeCardProps) {
    return (
        <>
            <Card
                variant="outlined"
                onClick={() => {
                    console.log({link})
                }}
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.28s ease, box-shadow 0.35s ease, background 0.6s ease',
                    backgroundColor: 'background.surface',
                    gap: 0,
                    p: 2,
                    // Fancy gradient glow border using an overlay pseudo-element
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        padding: '1px',
                        background: 'linear-gradient(125deg, var(--joy-palette-primary-400), var(--joy-palette-warning-400), var(--joy-palette-success-400))',
                        WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        opacity: 0,
                        filter: 'blur(2px) saturate(1.2)',
                        transition: 'opacity 0.5s ease',
                        pointerEvents: 'none'
                    },
                    '&:hover::before, &:focus-visible::before': {
                        opacity: 1
                    },
                    '&:hover': {
                        transform: 'scale(1.018)',
                        boxShadow: 'lg',
                        background: 'linear-gradient(140deg, var(--joy-palette-background-surface) 20%, var(--joy-palette-primary-softBg) 140%)'
                    },
                    '&:active': {
                        transform: 'scale(1.01)',
                        boxShadow: 'md'
                    },
                    '&:focus-visible': {
                        outline: '2px solid var(--joy-palette-primary-outlinedBorder)',
                        outlineOffset: 2,
                        boxShadow: 'lg'
                    }
                }}
            >
                <Avatar
                    size={'sm'}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8
                    }}
                />
                <Typography level={'h3'} sx={{width: 'calc(100% - 30px)'}}>
                    {name}
                </Typography>
                {description && (
                    <Typography
                        level="body-sm"
                        title={description}
                        sx={{
                            mt: 0.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            minHeight: '2.4em', // reserves space so cards align (approx 2 lines)
                            lineHeight: 1.2,
                            color: 'text.tertiary'
                        }}
                    >
                        {description}
                    </Typography>
                )}
                <Divider sx={{my: 2}}/>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        overflow: 'auto',
                    }}
                >
                    {tags.map(tag => {
                        const chipColor: JoyColours | undefined = tag.color;
                        return (
                            <Chip
                                key={tag.tagName}
                                variant={'soft'}
                                size={'lg'}
                                color={chipColor}
                            >
                                {tag.tagName}
                            </Chip>
                        );
                    })}
                </Box>
            </Card>
        </>
    )
}

export default RecipeCard;

