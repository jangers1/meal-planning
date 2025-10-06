import {useMemo} from 'react';
import {PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import type {DistanceMeasurement} from '@dnd-kit/core';
import {DRAG_DELAY_MS, DRAG_TOLERANCE_PX} from '../constants';

type DelayConstraint = {
    delay: number;
    tolerance: DistanceMeasurement;
};

type DistanceConstraint = {
    distance: DistanceMeasurement;
    tolerance?: DistanceMeasurement;
};

type PointerActivationConstraint = DelayConstraint | DistanceConstraint | (DelayConstraint & DistanceConstraint);

export interface UseDragSensorsOptions {
    /**
     * Whether to enable activation delay (useful when dragging from containers)
     */
    enableDelay?: boolean;
    /**
     * Custom activation constraint (overrides enableDelay)
     */
    activationConstraint?: PointerActivationConstraint;
}

/**
 * Hook to create configured drag sensors
 * Handles activation constraints for drag delays
 */
export function useDragSensors({
    enableDelay = false,
    activationConstraint,
}: UseDragSensorsOptions = {}) {
    const constraint = useMemo<PointerActivationConstraint | undefined>(() => {
        if (activationConstraint) return activationConstraint;
        if (enableDelay) {
            return {delay: DRAG_DELAY_MS, tolerance: DRAG_TOLERANCE_PX};
        }
        return undefined;
    }, [enableDelay, activationConstraint]);

    return useSensors(
        useSensor(PointerSensor, {
            activationConstraint: constraint,
        })
    );
}
