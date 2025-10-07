import type {DropAnimation} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import {
    DROP_ANIMATION_DURATION_MS,
    // DROP_SCALE, // no longer used: we keep parent transform's scale unchanged
    DRAG_SHADOW,
    DEFAULT_SHADOW,
    DRAG_SCALE,
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
                // Animate to the final transform without forcing a scale change on the parent node.
                // The child element will animate its own scale from DRAG_SCALE -> 1 in sideEffects.
                transform: CSS.Transform.toString(transform.final),
            },
        ];
    },
    // Ensure the JS-driven animation matches our CSS durations
    duration: DROP_ANIMATION_DURATION_MS,
    sideEffects({active, dragOverlay}) {
        // Hide original while animating overlay back to its spot
        active.node.style.opacity = '0';

        // Prefer the direct overlay content (first child inside .dnd-overlay-element),
        // fall back to a button/draggable element selector used previously
        const target = (
            dragOverlay.node.querySelector('.dnd-overlay-element > *') ||
            dragOverlay.node.querySelector('button, [data-draggable-element]')
        ) as HTMLElement | null;

        if (target) {
            // Animate both scale and shadow so the overlay ends at scale 1,
            // preventing a visible snap when switching back to the original node.
            target.animate(
                [
                    {transform: `scale(${DRAG_SCALE})`, boxShadow: DRAG_SHADOW},
                    {transform: 'scale(1)', boxShadow: DEFAULT_SHADOW},
                ],
                {
                    duration: DROP_ANIMATION_DURATION_MS,
                    easing: 'ease',
                    fill: 'forwards',
                }
            );
        } else {
            // Fallback: only animate shadow on any known target
            const button = dragOverlay.node.querySelector('button, [data-draggable-element]');
            if (button) {
                (button as HTMLElement).animate(
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
        }

        return () => {
            active.node.style.opacity = '';
        };
    },
};
