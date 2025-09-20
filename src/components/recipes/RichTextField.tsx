import React, {useCallback, useMemo, useState} from 'react';
import type {BaseEditor, Descendant} from 'slate';
import {createEditor, Editor, Element as SlateElement, Transforms} from 'slate';
import {Editable, ReactEditor, Slate, useSlate, withReact} from 'slate-react';
import {withHistory} from 'slate-history';
import {Box, Button, ButtonGroup, Divider, Option, Select, Sheet, Typography} from '@mui/joy';
import {
    Code,
    FormatBold,
    FormatItalic,
    FormatListBulleted,
    FormatListNumbered,
    FormatUnderlined
} from '@mui/icons-material';

// Define types for our custom elements and marks
type ParagraphElement = {
    type: 'paragraph';
    children: CustomText[];
};

type HeadingElement = {
    type: 'heading-one' | 'heading-two';
    children: CustomText[];
};

type BlockQuoteElement = {
    type: 'block-quote';
    children: CustomText[];
};

type CodeBlockElement = {
    type: 'code-block';
    children: CustomText[];
};

type ListElement = {
    type: 'bulleted-list' | 'numbered-list';
    children: ListItemElement[];
};

type ListItemElement = {
    type: 'list-item';
    children: CustomText[];
};

type CustomElement =
    ParagraphElement
    | HeadingElement
    | BlockQuoteElement
    | CodeBlockElement
    | ListElement
    | ListItemElement;

type CustomText = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    code?: boolean;
};

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}

// Helper functions for formatting
const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const isBlockActive = (editor: Editor, format: string, blockType = 'type') => {
    const {selection} = editor;
    if (!selection) return false;

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n[blockType as keyof CustomElement] === format,
        })
    );

    return !!match;
};

const isMarkActive = (editor: Editor, format: keyof CustomText) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format as keyof typeof marks] === true : false;
};

const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    );
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type),
        split: true,
    });

    let newProperties: Partial<CustomElement>;
    if (TEXT_ALIGN_TYPES.includes(format)) {
        newProperties = {} as Partial<CustomElement>;
    } else {
        newProperties = {
            type: isActive ? 'paragraph' : (format as CustomElement['type']),
        };
    }

    Transforms.setNodes<CustomElement>(editor, newProperties);

    if (!isActive && isList) {
        const block = {type: format as CustomElement['type'], children: []};
        Transforms.wrapNodes(editor, block);
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

// Toolbar components
const MarkButton = ({format, icon, ...props}: { format: keyof CustomText; icon: React.ReactNode }) => {
    const editor = useSlate();
    return (
        <Button
            variant={isMarkActive(editor, format) ? 'solid' : 'outlined'}
            size="sm"
            onMouseDown={(event: React.MouseEvent) => {
                event.preventDefault();
                toggleMark(editor, format);
            }}
            {...props}
        >
            {icon}
        </Button>
    );
};

const BlockButton = ({format, icon, ...props}: { format: string; icon: React.ReactNode }) => {
    const editor = useSlate();
    return (
        <Button
            variant={isBlockActive(editor, format) ? 'solid' : 'outlined'}
            size="sm"
            onMouseDown={(event: React.MouseEvent) => {
                event.preventDefault();
                toggleBlock(editor, format);
            }}
            {...props}
        >
            {icon}
        </Button>
    );
};

const Toolbar = () => {
    const editor = useSlate();

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                padding: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                flexWrap: 'wrap'
            }}
        >
            {/* Text Format Dropdown */}
            <Select
                size="sm"
                value={
                    isBlockActive(editor, 'heading-one') ? 'heading-one' :
                        isBlockActive(editor, 'heading-two') ? 'heading-two' :
                            isBlockActive(editor, 'block-quote') ? 'block-quote' :
                                isBlockActive(editor, 'code-block') ? 'code-block' :
                                    'paragraph'
                }
                onChange={(_, value) => {
                    if (value) {
                        toggleBlock(editor, value);
                    }
                }}
            >
                <Option value="paragraph">Paragraph</Option>
                <Option value="heading-one">Heading 1</Option>
                <Option value="heading-two">Heading 2</Option>
                <Option value="block-quote">Quote</Option>
                <Option value="code-block">Code Block</Option>
            </Select>

            <Divider orientation="vertical"/>

            {/* Text Formatting */}
            <ButtonGroup variant="outlined" size="sm">
                <MarkButton format="bold" icon={<FormatBold/>}/>
                <MarkButton format="italic" icon={<FormatItalic/>}/>
                <MarkButton format="underline" icon={<FormatUnderlined/>}/>
                <MarkButton format="code" icon={<Code/>}/>
            </ButtonGroup>

            <Divider orientation="vertical"/>

            {/* Lists */}
            <ButtonGroup variant="outlined" size="sm">
                <BlockButton format="bulleted-list" icon={<FormatListBulleted/>}/>
                <BlockButton format="numbered-list" icon={<FormatListNumbered/>}/>
            </ButtonGroup>
        </Box>
    );
};

// Define proper types for Slate render props
type ElementRenderProps = {
    attributes: {
        'data-slate-node': 'element';
        'data-slate-inline'?: true;
        'data-slate-void'?: true;
        dir?: 'rtl';
        ref: React.RefObject<HTMLElement>;
    };
    children: React.ReactNode;
    element: CustomElement;
};

type LeafRenderProps = {
    attributes: {
        'data-slate-leaf': true;
    };
    children: React.ReactNode;
    leaf: CustomText;
};

// Render functions for different elements
const Element = ({attributes, children, element}: ElementRenderProps) => {
    switch (element.type) {
        case 'block-quote':
            return (
                <Box
                    {...attributes}
                    component="blockquote"
                    sx={{
                        borderLeft: '4px solid',
                        borderColor: 'primary.main',
                        paddingLeft: 2,
                        marginLeft: 0,
                        fontStyle: 'italic',
                        backgroundColor: 'neutral.50'
                    }}
                >
                    {children}
                </Box>
            );
        case 'bulleted-list':
            return (
                <Box {...attributes} component="ul">
                    {children}
                </Box>
            );
        case 'heading-one':
            return (
                <Typography level="h1" {...attributes}>
                    {children}
                </Typography>
            );
        case 'heading-two':
            return (
                <Typography level="h2" {...attributes}>
                    {children}
                </Typography>
            );
        case 'list-item':
            return (
                <Box {...attributes} component="li">
                    {children}
                </Box>
            );
        case 'numbered-list':
            return (
                <Box {...attributes} component="ol">
                    {children}
                </Box>
            );
        case 'code-block':
            return (
                <Box
                    {...attributes}
                    component="pre"
                    sx={{
                        backgroundColor: 'neutral.100',
                        padding: 2,
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        overflow: 'auto'
                    }}
                >
                    <code>{children}</code>
                </Box>
            );
        default:
            return (
                <Typography {...attributes}>
                    {children}
                </Typography>
            );
    }
};

const Leaf = ({attributes, children, leaf}: LeafRenderProps) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.code) {
        children = (
            <Box
                component="code"
                sx={{
                    backgroundColor: 'neutral.100',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '0.9em'
                }}
            >
                {children}
            </Box>
        );
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underline) {
        children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
};

// Main SlateJS component
const RichTextField: React.FC = () => {
    const renderElement = useCallback((props: ElementRenderProps) => <Element {...props} />, []);
    const renderLeaf = useCallback((props: LeafRenderProps) => <Leaf {...props} />, []);
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    const [value, setValue] = useState<Descendant[]>([]);

    return (
        <Sheet
            variant="outlined"
            sx={{
                maxWidth: '800px',
                margin: '0 auto',
                borderRadius: 'md',
                overflow: 'hidden'
            }}
        >
            <Slate editor={editor} initialValue={value} onValueChange={setValue}>
                <Toolbar/>
                <Box
                    sx={{
                        padding: 3,
                        minHeight: '400px',
                        '& > *': {
                            marginBottom: 1
                        }
                    }}
                >
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
                        onKeyDown={(event) => {
                            // Handle keyboard shortcuts
                            if (event.ctrlKey || event.metaKey) {
                                switch (event.key) {
                                    case 'b': {
                                        event.preventDefault();
                                        toggleMark(editor, 'bold');
                                        break;
                                    }
                                    case 'i': {
                                        event.preventDefault();
                                        toggleMark(editor, 'italic');
                                        break;
                                    }
                                    case 'u': {
                                        event.preventDefault();
                                        toggleMark(editor, 'underline');
                                        break;
                                    }
                                    case '`': {
                                        event.preventDefault();
                                        toggleMark(editor, 'code');
                                        break;
                                    }
                                }
                            }
                        }}
                    />
                </Box>
            </Slate>
        </Sheet>
    );
};

export default RichTextField;
