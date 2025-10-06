import type {DropAnimation} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import {
    DROP_ANIMATION_DURATION_MS,
    DROP_SCALE,
    DRAG_SHADOW,
    DEFAULT_SHADOW,
} from './constants';

/**
 * Drop animation configuration for smooth scale-down and shadow fade
 * This creates the animation when an item is released and returns to its position
 */
export const dropAnimationConfig: DropAnimation = {
    keyframes({transform}) {
        return [
            {transform: CSS.Transform.toString(transform.initial)},
            {
                transform: CSS.Transform.toString({
                    ...transform.final,
                    scaleX: DROP_SCALE,
                    scaleY: DROP_SCALE,
                }),
            },
        ];
    },
    sideEffects({active, dragOverlay}) {
        active.node.style.opacity = '0';

        const button = dragOverlay.node.querySelector('button, [data-draggable-element]');
        if (button) {
            button.animate(
                [
                    {boxShadow: DRAG_SHADOW},
                    {boxShadow: DEFAULT_SHADOW},
                ],
                {
                    duration: DROP_ANIMATION_DURATION_MS,
                    easing: 'ease',
                    fill: 'forwards',
                }
            );
        }

        return () => {
            active.node.style.opacity = '';
        };
    },
};

