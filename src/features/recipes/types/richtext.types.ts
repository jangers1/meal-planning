import type { BaseEditor } from 'slate';
import type { ReactEditor } from 'slate-react';

export type CustomText = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
};

export type CustomElement =
    | { type: 'paragraph' | 'heading-one' | 'heading-two' | 'block-quote' | 'list-item'; children: CustomText[] }
    | { type: 'bulleted-list' | 'numbered-list'; children: { type: 'list-item'; children: CustomText[] }[] };

export type RenderElementProps = {
    attributes: Record<string, unknown>;
    children: React.ReactNode;
    element: CustomElement;
};

export type RenderLeafProps = {
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
