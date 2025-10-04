import { Editor, Element as SlateElement, Transforms } from 'slate';
import type { CustomText, CustomElement } from '../../../types/richtext.types.ts';

// Configuration
export const LIST_TYPES = ['numbered-list', 'bulleted-list'];
export const HOTKEYS = {'b': 'bold', 'i': 'italic', 'u': 'underline'} as const;

// Helper functions
export const isBlockActive = (editor: Editor, format: string) => {
    const [match] = Array.from(
        Editor.nodes(editor, {
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
        })
    );
    return !!match;
};

export const isMarkActive = (editor: Editor, format: keyof CustomText) => {
    const marks = Editor.marks(editor);
    if (!marks || format === 'text') return false;
    return Boolean(marks[format]);
};

export const isListItemActive = (editor: Editor) => {
    const [match] = Array.from(
        Editor.nodes(editor, {
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'list-item',
        })
    );
    return !!match;
};

export const indentListItem = (editor: Editor) => {
    if (!isListItemActive(editor)) return;

    Transforms.wrapNodes(editor, {
        type: 'bulleted-list',
        children: []
    });
};

export const unindentListItem = (editor: Editor) => {
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

export const toggleBlock = (editor: Editor, format: string) => {
    const isList = LIST_TYPES.includes(format);
    const isActive = isBlockActive(editor, format);

    if (isList) {
        Transforms.unwrapNodes(editor, {
            match: n => SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
            split: true,
        });
    }

    const newType: CustomElement['type'] = isActive ? 'paragraph' : (isList ? 'list-item' : format as CustomElement['type']);
    Transforms.setNodes<SlateElement>(editor, {type: newType});

    if (!isActive && isList) {
        const wrapType: CustomElement['type'] = format as CustomElement['type'];
        Transforms.wrapNodes(editor, {type: wrapType, children: []});
    }
};

export const toggleMark = (editor: Editor, format: keyof CustomText) => {
    const formatStr = format as string;
    if (isMarkActive(editor, format)) {
        Editor.removeMark(editor, formatStr);
    } else {
        Editor.addMark(editor, formatStr, true);
    }
};
