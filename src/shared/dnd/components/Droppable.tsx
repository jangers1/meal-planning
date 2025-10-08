import {useDroppable} from '@dnd-kit/core';
import '../styles.css';
import React from "react";

export interface DroppableProps {
    id: string;
    children: React.ReactNode | ((isOver: boolean) => React.ReactNode);
    className?: string;
    disabled?: boolean;
}

/**
 * Reusable droppable zone component
 * Creates a drop zone that accepts draggable items
 * Provides visual feedback when items are hovering over it
 * Children can be a render function that receives isOver state
 */
export function Droppable({id, children, className = '', disabled = false}: DroppableProps) {
    const {setNodeRef, isOver} = useDroppable({
        id,
        disabled,
    });

    const droppableClasses = [
        'dnd-droppable-zone',
        className
    ].filter(Boolean).join(' ');

    return (
        <div ref={setNodeRef} className={droppableClasses} data-droppable-id={id}>
            {typeof children === 'function' ? children(isOver && !disabled) : children}
        </div>
    );
}
