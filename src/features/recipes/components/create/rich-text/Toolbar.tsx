import { Box, ButtonGroup, Divider, Option, Select } from '@mui/joy';
import { useSlate } from 'slate-react';
import { FormatBold, FormatItalic, FormatListBulleted, FormatListNumbered, FormatUnderlined } from '@mui/icons-material';
import { MarkButton } from './MarkButton.tsx';
import { BlockButton } from './BlockButton.tsx';
import { isBlockActive, toggleBlock } from './utils.ts';

export function Toolbar() {
    const editor = useSlate();

    const getCurrentBlockType = () => {
        if (isBlockActive(editor, 'heading-one')) return 'heading-one';
        if (isBlockActive(editor, 'heading-two')) return 'heading-two';
        if (isBlockActive(editor, 'block-quote')) return 'block-quote';
        return 'paragraph';
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1,
            borderBottom: '1px solid',
            borderColor: 'divider'
        }}>
            <Select
                size="sm"
                value={getCurrentBlockType()}
                onChange={(_, value) => value && toggleBlock(editor, value)}
            >
                <Option value="paragraph">Paragraph</Option>
                <Option value="heading-one">Heading 1</Option>
                <Option value="heading-two">Heading 2</Option>
                <Option value="block-quote">Quote</Option>
            </Select>

            <Divider orientation="vertical"/>

            <ButtonGroup size="sm">
                <MarkButton format="bold" icon={<FormatBold/>}/>
                <MarkButton format="italic" icon={<FormatItalic/>}/>
                <MarkButton format="underline" icon={<FormatUnderlined/>}/>
            </ButtonGroup>

            <Divider orientation="vertical"/>

            <ButtonGroup size="sm">
                <BlockButton format="bulleted-list" icon={<FormatListBulleted/>}/>
                <BlockButton format="numbered-list" icon={<FormatListNumbered/>}/>
            </ButtonGroup>
        </Box>
    );
}
