import React, {useCallback, useMemo, useState} from 'react';
import type {BaseEditor, Descendant} from 'slate';
import {createEditor, Editor, Element as SlateElement, Transforms} from 'slate';
import {Editable, ReactEditor, Slate, useSlate, withReact} from 'slate-react';
import {withHistory} from 'slate-history';
import {Box, Button, ButtonGroup, Divider, Option, Select, Sheet, Typography} from '@mui/joy';
import {FormatBold, FormatItalic, FormatListBulleted, FormatListNumbered, FormatUnderlined} from '@mui/icons-material';

// Types
type CustomText = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
};

type CustomElement =
    | { type: 'paragraph' | 'heading-one' | 'heading-two' | 'block-quote' | 'list-item'; children: CustomText[] }
    | { type: 'bulleted-list' | 'numbered-list'; children: { type: 'list-item'; children: CustomText[] }[] };

type RenderElementProps = {
    attributes: Record<string, unknown>;
    children: React.ReactNode;
    element: CustomElement;
};

type RenderLeafProps = {
    attributes: Record<string, unknown>;
    children: React.ReactNode;
    leaf: CustomText;
};

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}

// Configuration
const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const HOTKEYS = {'b': 'bold', 'i': 'italic', 'u': 'underline'} as const;

// Helper functions
const isBlockActive = (editor: Editor, format: string) => {
    const [match] = Array.from(
        Editor.nodes(editor, {
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
        })
    );
    return !!match;
};

const isMarkActive = (editor: Editor, format: keyof CustomText) => {
    const marks = Editor.marks(editor);
    if (!marks || format === 'text') return false;
    return Boolean(marks[format]);
};

const isListItemActive = (editor: Editor) => {
    const [match] = Array.from(
        Editor.nodes(editor, {
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'list-item',
        })
    );
    return !!match;
};

const indentListItem = (editor: Editor) => {
    if (!isListItemActive(editor)) return;

    Transforms.wrapNodes(editor, {
        type: 'bulleted-list',
        children: []
    });
};

const unindentListItem = (editor: Editor) => {
    if (!isListItemActive(editor)) return;

    // Check if we're in a nested list
    const [listMatch] = Array.from(
        Editor.nodes(editor, {
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
        })
    );

    if (listMatch) {
        Transforms.unwrapNodes(editor, {
            match: n => SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
        });
    }
};

const toggleBlock = (editor: Editor, format: string) => {
    const isList = LIST_TYPES.includes(format);
    const isActive = isBlockActive(editor, format);

    if (isList) {
        Transforms.unwrapNodes(editor, {
            match: n => SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
            split: true,
        });
    }

    const newType = isActive ? 'paragraph' : (isList ? 'list-item' : format as CustomElement['type']);
    Transforms.setNodes<SlateElement>(editor, {type: newType});

    if (!isActive && isList) {
        Transforms.wrapNodes(editor, {type: format as CustomElement['type'], children: []});
    }
};

const toggleMark = (editor: Editor, format: keyof CustomText) => {
    if (isMarkActive(editor, format)) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

// Components
const MarkButton = ({format, icon}: { format: keyof CustomText; icon: React.ReactNode }) => {
    const editor = useSlate();
    return (
        <Button
            variant={isMarkActive(editor, format) ? 'solid' : 'outlined'}
            size="sm"
            onMouseDown={(e) => {
                e.preventDefault();
                toggleMark(editor, format);
            }}
        >
            {icon}
        </Button>
    );
};

const BlockButton = ({format, icon}: { format: string; icon: React.ReactNode }) => {
    const editor = useSlate();
    return (
        <Button
            variant={isBlockActive(editor, format) ? 'solid' : 'outlined'}
            size="sm"
            onMouseDown={(e) => {
                e.preventDefault();
                toggleBlock(editor, format);
            }}
        >
            {icon}
        </Button>
    );
};

const Toolbar = () => {
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
            <Select size="sm" value={getCurrentBlockType()}
                    onChange={(_, value) => value && toggleBlock(editor, value)}>
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
};

const Element = ({attributes, children, element}: RenderElementProps) => {
    const listStyles = {paddingLeft: 3, marginLeft: 0, listStylePosition: 'outside' as const};

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
            return <Box {...attributes} component="ul" sx={{...listStyles, listStyleType: 'disc'}}>{children}</Box>;
        case 'numbered-list':
            return <Box {...attributes} component="ol" sx={{...listStyles, listStyleType: 'decimal'}}>{children}</Box>;
        case 'heading-one':
            return <Typography level="h1" {...attributes}>{children}</Typography>;
        case 'heading-two':
            return <Typography level="h2" {...attributes}>{children}</Typography>;
        case 'list-item':
            return <Box {...attributes} component="li" sx={{pl: 1, mb: 0.5}}>{children}</Box>;
        default:
            return <Typography {...attributes}>{children}</Typography>;
    }
};

const Leaf = ({attributes, children, leaf}: RenderLeafProps) => {
    let result: React.ReactNode = children;
    if (leaf.bold) result = <strong>{result}</strong>;
    if (leaf.italic) result = <em>{result}</em>;
    if (leaf.underline) result = <u>{result}</u>;
    return <span {...attributes}>{result}</span>;
};

const RichTextField: React.FC = () => {
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const [value, setValue] = useState<Descendant[]>([{type: 'paragraph', children: [{text: ''}]}]);

    const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
    const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        // Handle hotkeys for formatting
        const hotkey = (event.ctrlKey || event.metaKey) && HOTKEYS[event.key as keyof typeof HOTKEYS];
        if (hotkey) {
            event.preventDefault();
            toggleMark(editor, hotkey as keyof CustomText);
            return;
        }

        // Handle Tab for list indentation
        if (event.key === 'Tab') {
            if (isListItemActive(editor)) {
                event.preventDefault();
                if (event.shiftKey) {
                    unindentListItem(editor);
                } else {
                    indentListItem(editor);
                }
            }
        }
    };

    return (
        <Sheet variant="outlined" sx={{borderRadius: 'md', display: 'flex', flexDirection: 'column', maxHeight: '90%'}}>
            <Slate editor={editor} initialValue={value} onValueChange={setValue}>
                <Toolbar/>
                <Box sx={{flex: 1, overflowY: 'auto', p: 2}}>
                    <Editable
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        placeholder="Type recipe here. Any formatting will save."
                        spellCheck
                        autoFocus
                        style={{flex: 1, outline: 'none', width: '100%'}}
                        onKeyDown={handleKeyDown}
                    />
                </Box>
            </Slate>
        </Sheet>
    );
};

export default RichTextField;
