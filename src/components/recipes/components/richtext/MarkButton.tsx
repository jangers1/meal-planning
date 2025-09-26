import React from 'react';
import { Button } from '@mui/joy';
import { useSlate } from 'slate-react';
import { isMarkActive, toggleMark } from './utils';
import type { CustomText } from '../../types/richtext.types';

interface MarkButtonProps {
    format: keyof CustomText;
    icon: React.ReactNode;
}

export function MarkButton({ format, icon }: MarkButtonProps) {
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
}
