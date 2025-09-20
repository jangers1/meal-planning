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
    | { type: 'paragraph'; children: CustomText[] }
    | { type: 'heading-one' | 'heading-two'; children: CustomText[] }
    | { type: 'block-quote'; children: CustomText[] }
    | { type: 'bulleted-list' | 'numbered-list'; children: ListItemElement[] }
    | { type: 'list-item'; children: CustomText[] };

type ListItemElement = { type: 'list-item'; children: CustomText[] };

type ElementProps = {
    attributes: Record<string, unknown>;
    children: React.ReactNode;
    element: CustomElement;
};

type LeafProps = {
    attributes: Record<string, unknown>;
    children: React.ReactNode;
    leaf: CustomText;
};

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

// Constants
const LIST_TYPES = ['numbered-list', 'bulleted-list'] as const;
const MARK_HOTKEYS = {
    'b': 'bold',
    'i': 'italic',
    'u': 'underline'
} as const;

type ListType = typeof LIST_TYPES[number];

// Helper functions
const isListType = (type: string): type is ListType => {
    return LIST_TYPES.includes(type as ListType);
};

const isBlockActive = (editor: Editor, format: string) => {
    const {selection} = editor;
    if (!selection) return false;

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
        })
    );
    return !!match;
};

const isListActive = (editor: Editor, format: string) => {
    const {selection} = editor;
    if (!selection) return false;

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: n => {
                if (!SlateElement.isElement(n)) return false;

                if (n.type === format) return true;

                if (n.type === 'list-item') {
                    try {
                        const nodePath = ReactEditor.findPath(editor, n);
                        const parentPath = Editor.parent(editor, nodePath);
                        return SlateElement.isElement(parentPath[0]) && parentPath[0].type === format;
                    } catch {
                        return false;
                    }
                }
                return false;
            },
        })
    );
    return !!match;
};

const isMarkActive = (editor: Editor, format: keyof CustomText) => {
    const marks = Editor.marks(editor);
    return marks && format in marks ? Boolean(marks[format as keyof typeof marks]) : false;
};

const toggleBlock = (editor: Editor, format: string) => {
    const isList = isListType(format);
    const isActive = isList ? isListActive(editor, format) : isBlockActive(editor, format);

    Transforms.unwrapNodes(editor, {
        match: n => SlateElement.isElement(n) && isListType(n.type),
        split: true,
    });

    const newType = isActive ? 'paragraph' : (isList ? 'list-item' : format as CustomElement['type']);
    Transforms.setNodes<SlateElement>(editor, {type: newType});

    if (!isActive && isList) {
        Transforms.wrapNodes(editor, {type: format as CustomElement['type'], children: []});
    }
};

const toggleMark = (editor: Editor, format: keyof CustomText) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const handleTabInList = (editor: Editor, event: React.KeyboardEvent) => {
    const {selection} = editor;
    if (!selection) return false;

    const [listItemMatch] = Array.from(
        Editor.nodes(editor, {
            at: selection,
            match: n => SlateElement.isElement(n) && n.type === 'list-item',
        })
    );

    if (!listItemMatch) return false;

    event.preventDefault();

    if (event.shiftKey) {
        Transforms.liftNodes(editor, {
            match: n => SlateElement.isElement(n) && n.type === 'list-item',
        });
    } else {
        const parentPath = Editor.parent(editor, listItemMatch[1]);
        const parentListType = SlateElement.isElement(parentPath[0]) ? parentPath[0].type : 'bulleted-list';

        Transforms.wrapNodes(editor, {
            type: parentListType as 'bulleted-list' | 'numbered-list',
            children: []
        }, {
            match: n => SlateElement.isElement(n) && n.type === 'list-item',
        });
    }
    return true;
};

// Component types
type ButtonProps = {
    format: string;
    icon: React.ReactNode;
};

// Toolbar components
const MarkButton = ({format, icon}: ButtonProps & { format: keyof CustomText }) => {
    const editor = useSlate();
    return (
        <Button
            variant={isMarkActive(editor, format) ? 'solid' : 'outlined'}
            size="sm"
            onMouseDown={(event) => {
                event.preventDefault();
                toggleMark(editor, format);
            }}
        >
            {icon}
        </Button>
    );
};

const BlockButton = ({format, icon}: ButtonProps) => {
    const editor = useSlate();
    const isList = isListType(format);
    const isActive = isList ? isListActive(editor, format) : isBlockActive(editor, format);

    return (
        <Button
            variant={isActive ? 'solid' : 'outlined'}
            size="sm"
            onMouseDown={(event) => {
                event.preventDefault();
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
            padding: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            flexWrap: 'wrap'
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

            <ButtonGroup variant="outlined" size="sm">
                <MarkButton format="bold" icon={<FormatBold/>}/>
                <MarkButton format="italic" icon={<FormatItalic/>}/>
                <MarkButton format="underline" icon={<FormatUnderlined/>}/>
            </ButtonGroup>

            <Divider orientation="vertical"/>

            <ButtonGroup variant="outlined" size="sm">
                <BlockButton format="bulleted-list" icon={<FormatListBulleted/>}/>
                <BlockButton format="numbered-list" icon={<FormatListNumbered/>}/>
            </ButtonGroup>
        </Box>
    );
};

// Render components
const Element = ({attributes, children, element}: ElementProps) => {
    const commonListStyles = {
        paddingLeft: 3,
        marginLeft: 0,
        listStylePosition: 'outside' as const
    };

    switch (element.type) {
        case 'block-quote':
            return (
                <Box {...attributes} component="blockquote" sx={{
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    paddingLeft: 2,
                    marginLeft: 0,
                    fontStyle: 'italic',
                    backgroundColor: 'neutral.50'
                }}>
                    {children}
                </Box>
            );
        case 'bulleted-list':
            return (
                <Box {...attributes} component="ul" sx={{...commonListStyles, listStyleType: 'disc'}}>
                    {children}
                </Box>
            );
        case 'numbered-list':
            return (
                <Box {...attributes} component="ol" sx={{...commonListStyles, listStyleType: 'decimal'}}>
                    {children}
                </Box>
            );
        case 'heading-one':
            return <Typography level="h1" {...attributes}>{children}</Typography>;
        case 'heading-two':
            return <Typography level="h2" {...attributes}>{children}</Typography>;
        case 'list-item':
            return (
                <Box {...attributes} component="li" sx={{paddingLeft: 1, marginBottom: 0.5}}>
                    {children}
                </Box>
            );
        default:
            return <Typography {...attributes}>{children}</Typography>;
    }
};

const Leaf = ({attributes, children, leaf}: LeafProps) => {
    let result: React.ReactNode = children;

    if (leaf.bold) result = <strong>{result}</strong>;
    if (leaf.italic) result = <em>{result}</em>;
    if (leaf.underline) result = <u>{result}</u>;

    return <span {...attributes}>{result}</span>;
};

// Main component
const RichTextField: React.FC = () => {
    const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
    const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    const [value, setValue] = useState<Descendant[]>([{
        type: 'paragraph',
        children: [{text: ''}]
    }]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        const isHotkey = (event.ctrlKey || event.metaKey) && MARK_HOTKEYS[event.key as keyof typeof MARK_HOTKEYS];

        if (isHotkey) {
            event.preventDefault();
            toggleMark(editor, MARK_HOTKEYS[event.key as keyof typeof MARK_HOTKEYS] as keyof CustomText);
        } else if (event.key === 'Tab') {
            handleTabInList(editor, event);
        }
    };

    return (
        <Sheet variant="outlined" sx={{
            maxWidth: '800px',
            margin: '0 auto',
            borderRadius: 'md',
            overflow: 'hidden'
        }}>
            <Slate editor={editor} initialValue={value} onValueChange={setValue}>
                <Toolbar/>
                <Box sx={{
                    padding: 3,
                    minHeight: '400px',
                    '& > *': {marginBottom: 1}
                }}>
                    <Editable
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        placeholder="Type recipe here. Any formatting will save."
                        spellCheck
                        autoFocus
                        style={{
                            minHeight: '350px',
                            outline: 'none'
                        }}
                        onKeyDown={handleKeyDown}
                    />
                </Box>
            </Slate>
        </Sheet>
    );
};

export default RichTextField;
