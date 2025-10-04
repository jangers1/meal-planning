import { Box, Typography } from '@mui/joy';
import type { RenderElementProps } from '../../../types/richtext.types.ts';

export function Element({ attributes, children, element }: RenderElementProps) {
    const listStyles = { paddingLeft: 3, marginLeft: 0, listStylePosition: 'outside' as const };

    switch (element.type) {
        case 'block-quote':
            return (
                <Box {...attributes} component="blockquote" sx={{
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    pl: 2,
                    ml: 0,
                    fontStyle: 'italic',
                    backgroundColor: 'neutral.50'
                }}>
                    {children}
                </Box>
            );
        case 'bulleted-list':
            return <Box {...attributes} component="ul" sx={{ ...listStyles, listStyleType: 'disc' }}>{children}</Box>;
        case 'numbered-list':
            return <Box {...attributes} component="ol" sx={{ ...listStyles, listStyleType: 'decimal' }}>{children}</Box>;
        case 'heading-one':
            return <Typography level="h1" {...attributes}>{children}</Typography>;
        case 'heading-two':
            return <Typography level="h2" {...attributes}>{children}</Typography>;
        case 'list-item':
            return <Box {...attributes} component="li" sx={{ pl: 1, mb: 0.5 }}>{children}</Box>;
        default:
            return <Typography {...attributes}>{children}</Typography>;
    }
}
