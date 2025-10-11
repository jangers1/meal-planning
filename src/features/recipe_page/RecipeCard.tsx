import {Avatar, Card, Divider} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Chip from '@mui/joy/Chip';
import type {JoyColours} from '../../shared/types/ui.types.ts';
import { gradientGlowCardStyle } from '../../shared/utils/cardStyles.ts';

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
                    ...gradientGlowCardStyle,
                    gap: 0,
                    p: 2,
                    flex: 1
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
