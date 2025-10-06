import {useDroppable} from '@dnd-kit/core';
import clsx from 'clsx';
import '../styles.css';
import React from "react";

export interface DroppableProps {
    id: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

/**
 * Reusable droppable zone component
 * Creates a drop zone that accepts draggable items
 * Provides visual feedback when items are hovering over it
 */
export function Droppable({id, children, className, disabled = false}: DroppableProps) {
    const {setNodeRef, isOver} = useDroppable({
        id,
        disabled,
    });

    const droppableClassName = clsx(
        'dnd-droppable-zone',
        {
            over: isOver && !disabled,
        },
        className
    );

    return (
        <div ref={setNodeRef} className={droppableClassName}>
            {children}
        </div>
    );
}

