import React, {useCallback, useState} from 'react';
import type {DragPendingEvent} from '@dnd-kit/core';
import {useDndMonitor, useDraggable} from '@dnd-kit/core';
import clsx from 'clsx';
import '../styles.css';

export interface DraggableProps {
    id: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

/**
 * Reusable draggable wrapper component
 * Wraps any content to make it draggable with smooth animations
 * Handles pending delay visual feedback automatically
 */
export function Draggable({id, children, className, disabled = false}: DraggableProps) {
    const {attributes, listeners, setNodeRef, isDragging} = useDraggable({
        id,
        disabled,
    });

    const [isPending, setIsPending] = useState(false);
    const [pendingDelayMs, setPendingDelay] = useState(0);

    const handlePending = useCallback((event: DragPendingEvent) => {
        setIsPending(true);
        const {constraint} = event;
        if ('delay' in constraint) {
            setPendingDelay(constraint.delay);
        }
    }, []);

    const handlePendingEnd = useCallback(() => {
        setIsPending(false);
        setPendingDelay(0);
    }, []);

    useDndMonitor({
        onDragPending: handlePending,
        onDragAbort: handlePendingEnd,
        onDragCancel: handlePendingEnd,
        onDragEnd: handlePendingEnd,
    });

    const isPendingWithDelay = isPending && pendingDelayMs > 0;
    const elementStyle = isPendingWithDelay ? {animationDuration: `${pendingDelayMs}ms`} : undefined;

    const wrapperClassName = clsx(
        'dnd-draggable-wrapper',
        {
            dragging: isDragging,
            'pending-delay': isPendingWithDelay,
        },
        className
    );

    return (
        <div ref={setNodeRef} className={wrapperClassName}>
            <div
                data-draggable-element
                style={elementStyle}
                {...listeners}
                {...attributes}
            >
                {children}
            </div>
        </div>
    );
}

