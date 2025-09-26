import React from 'react';
import { Button } from '@mui/joy';
import { useSlate } from 'slate-react';
import { isBlockActive, toggleBlock } from './utils';

interface BlockButtonProps {
    format: string;
    icon: React.ReactNode;
}

export function BlockButton({ format, icon }: BlockButtonProps) {
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
}
