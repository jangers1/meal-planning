import React from 'react';
import type { RenderLeafProps } from '../../../types/richtext.types.ts';

export function Leaf({ attributes, children, leaf }: RenderLeafProps) {
    let result: React.ReactNode = children;
    if (leaf.bold) result = <strong>{result}</strong>;
    if (leaf.italic) result = <em>{result}</em>;
    if (leaf.underline) result = <u>{result}</u>;
    return <span {...attributes}>{result}</span>;
}
