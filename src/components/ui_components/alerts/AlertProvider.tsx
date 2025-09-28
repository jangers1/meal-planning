import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import type {AlertProps} from '@mui/joy';
import {Alert, Box, CircularProgress, IconButton, LinearProgress, Stack, Typography} from '@mui/joy';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {createPortal} from 'react-dom';

// Public types
export interface AlertOptions {
    id?: string;
    title?: React.ReactNode;
    message?: React.ReactNode;
    color?: AlertProps['color'];
    variant?: AlertProps['variant'];
    loading?: boolean; // Shows a spinner at start of content
    withProgress?: boolean; // Shows a progress bar at bottom
    progress?: number; // 0-100, if undefined and withProgress => indeterminate
    autoHideDuration?: number; // ms
    persistent?: boolean; // if true will not auto-dismiss and can overflow max stack
    action?: React.ReactNode; // custom action (e.g. button)
    onClose?: () => void;
    icon?: React.ReactNode; // custom icon override
    disableCloseButton?: boolean;
}

interface InternalAlert extends AlertOptions {
    id: string;
    createdAt: number;
    status: 'enter' | 'active' | 'exit';
}

interface AlertsContextValue {
    alerts: InternalAlert[];
    push: (options: AlertOptions) => string; // returns id
    pushSuccess: (message: React.ReactNode, opts?: Partial<AlertOptions>) => string;
    pushError: (message: React.ReactNode, opts?: Partial<AlertOptions>) => string;
    pushInfo: (message: React.ReactNode, opts?: Partial<AlertOptions>) => string;
    pushWarning: (message: React.ReactNode, opts?: Partial<AlertOptions>) => string;
    update: (id: string, patch: Partial<AlertOptions>) => void;
    dismiss: (id: string) => void;
    clear: () => void;
}

const AlertsContext = createContext<AlertsContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAlerts = () => {
    const ctx = useContext(AlertsContext);
    if (!ctx) throw new Error('useAlerts must be used within an AlertProvider');
    return ctx;
};

// Config
const ENTER_ANIMATION_MS = 40; // small delay before switching to active
const EXIT_ANIMATION_MS = 280; // must match CSS transition
const MAX_STACK = 5;

export const AlertProvider: React.FC<{
    children: React.ReactNode;
    maxStack?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    gap?: number;
}>
    = ({children, maxStack = MAX_STACK, position = 'bottom-right', gap = 8}) => {
    const [alerts, setAlerts] = useState<InternalAlert[]>([]);
    const timers = useRef<Map<string, number>>(new Map());

    const dismiss = useCallback((id: string) => {
        let onClose: (() => void) | undefined;
        setAlerts(prev => {
            const target = prev.find(a => a.id === id);
            if (target) onClose = target.onClose;
            return prev.map(a => a.id === id ? {...a, status: 'exit'} : a);
        });
        const timeout = window.setTimeout(() => {
            setAlerts(prev => prev.filter(a => a.id !== id));
            const t = timers.current.get(id);
            if (t) window.clearTimeout(t);
            timers.current.delete(id);
            onClose?.();
        }, EXIT_ANIMATION_MS);
        timers.current.set(id, timeout);
    }, []);

    const scheduleAutoHide = useCallback((alert: InternalAlert) => {
        if (alert.autoHideDuration && !alert.persistent) {
            const existing = timers.current.get(alert.id);
            if (existing) window.clearTimeout(existing);
            const timeoutId = window.setTimeout(() => dismiss(alert.id), alert.autoHideDuration);
            timers.current.set(alert.id, timeoutId);
        }
    }, [dismiss]);

    const push = useCallback((options: AlertOptions) => {
        const id = options.id || crypto.randomUUID();
        const normalized: AlertOptions = {
            ...options,
            progress: typeof options.progress === 'number' ? Math.min(100, Math.max(0, options.progress)) : options.progress
        };
        setAlerts(prev => {
            let next = [...prev];
            const nonPersistent = next.filter(a => !a.persistent);
            if (nonPersistent.length >= maxStack) {
                const toRemove = nonPersistent.sort((a, b) => a.createdAt - b.createdAt)[0];
                next = next.filter(a => a.id !== toRemove.id);
            }
            const internal: InternalAlert = {...normalized, id, createdAt: Date.now(), status: 'enter'};
            return [...next, internal];
        });
        setTimeout(() => {
            setAlerts(prev => prev.map(a => a.id === id && a.status === 'enter' ? {...a, status: 'active'} : a));
        }, ENTER_ANIMATION_MS);
        return id;
    }, [maxStack]);

    const update = useCallback((id: string, patch: Partial<AlertOptions>) => {
        setAlerts(prev => prev.map(a => a.id === id ? {
            ...a,
            ...patch,
            progress: typeof patch.progress === 'number' ? Math.min(100, Math.max(0, patch.progress)) : a.progress
        } : a));
    }, []);

    const clear = useCallback(() => {
        setAlerts(prev => prev.map(a => ({...a, status: 'exit'})));
        window.setTimeout(() => setAlerts([]), EXIT_ANIMATION_MS + 20);
        timers.current.forEach(id => window.clearTimeout(id));
        timers.current.clear();
    }, []);

    useEffect(() => {
        alerts.forEach(a => scheduleAutoHide(a));
        // Capture the current timers map reference for cleanup to satisfy exhaustive-deps rule
        const timersSnapshot = timers.current;
        return () => {
            timersSnapshot.forEach(t => window.clearTimeout(t));
            timersSnapshot.clear();
        };
    }, [alerts, scheduleAutoHide]);

    const value = useMemo<AlertsContextValue>(() => ({
        alerts,
        push,
        pushSuccess: (message, opts) => push({
            message,
            color: 'success',
            variant: 'soft',
            autoHideDuration: 3000, ...opts
        }),
        pushError: (message, opts) => push({
            message,
            color: 'danger',
            variant: 'soft',
            autoHideDuration: 5000, ...opts
        }),
        pushInfo: (message, opts) => push({
            message,
            color: 'primary',
            variant: 'soft',
            autoHideDuration: 4000, ...opts
        }),
        pushWarning: (message, opts) => push({
            message,
            color: 'warning',
            variant: 'soft',
            autoHideDuration: 5000, ...opts
        }),
        update,
        dismiss,
        clear
    }), [alerts, push, update, dismiss, clear]);

    return (
        <AlertsContext.Provider value={value}>
            {children}
            <AlertViewport alerts={alerts} dismiss={dismiss} gap={gap} position={position}/>
        </AlertsContext.Provider>
    );
};

interface AlertViewportProps {
    alerts: InternalAlert[];
    dismiss: (id: string) => void;
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    gap: number;
}

const AlertViewport: React.FC<AlertViewportProps> = ({alerts, dismiss, position, gap}) => {
    if (typeof document === 'undefined') return null;
    const [vertical, horizontal] = position.split('-') as ['top' | 'bottom', 'left' | 'right'];

    return createPortal(
        <Box sx={{
            position: 'fixed',
            zIndex: 10000,
            [vertical]: 16,
            [horizontal]: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: horizontal === 'right' ? 'flex-end' : 'flex-start',
            gap: `${gap}px`,
            pointerEvents: 'none'
        }} aria-live="polite" aria-atomic={false}>
            {alerts.map(alert => <AnimatedAlert key={alert.id} alert={alert} onDismiss={dismiss}
                                                alignEnd={horizontal === 'right'}/>)}
        </Box>, document.body
    );
};

const AnimatedAlert: React.FC<{ alert: InternalAlert; onDismiss: (id: string) => void; alignEnd: boolean; }> = ({
    alert,
    onDismiss,
    alignEnd
}) => {
    const {id, status, title, message, loading, withProgress, progress, action, icon, disableCloseButton} = alert;

    // Build dynamic styles for entry / exit animations
    const baseTranslate = alignEnd ? 'translateX(16px)' : 'translateX(-16px)';
    const style: React.CSSProperties = {
        transition: 'transform 0.28s cubic-bezier(.4,0,.2,1), opacity 0.28s cubic-bezier(.4,0,.2,1)',
        transform: status === 'active' ? 'translateX(0) scale(1)' : `${baseTranslate} scale(.96)`,
        opacity: status === 'active' ? 1 : 0,
        pointerEvents: status === 'active' ? 'auto' : 'none', // prevent blocking underlying UI when hidden
        maxWidth: 600,
        width: '100%',
        boxShadow: 'lg'
    };

    const showProgress = withProgress || typeof progress === 'number';
    const determinate = typeof progress === 'number';

    const handleTransitionEnd: React.TransitionEventHandler<HTMLDivElement> = (e) => {
        if (status === 'exit' && e.propertyName === 'opacity') {
            // Force immediate removal by setting a zero autoHide duration + dismiss again if still present
            // Actual removal handled already by timeout, but we can shorten perceived blocking just in case.
        }
    };

    return (
        <Alert
            role="alert"
            aria-live="assertive"
            aria-atomic={false}
            aria-hidden={status !== 'active'}
            color={alert.color || 'neutral'}
            variant={alert.variant || 'soft'}
            sx={style}
            onTransitionEnd={handleTransitionEnd}
            startDecorator={loading ? <CircularProgress size="sm"/> : (icon || undefined)}
            endDecorator={
                <Stack direction="row" spacing={1} alignItems="center">
                    {action}
                    {!disableCloseButton && (
                        <IconButton size="sm" variant="plain" onClick={() => onDismiss(id)} aria-label="Close alert">
                            <CloseRoundedIcon/>
                        </IconButton>
                    )}
                </Stack>
            }
        >
            <Stack spacing={0.5} sx={{width: '100%'}}>
                {title && <Typography level="title-sm">{title}</Typography>}
                {message && <Typography level="body-sm">{message}</Typography>}
                {showProgress && (
                    <LinearProgress
                        determinate={determinate}
                        value={determinate ? progress : undefined}
                        variant="soft"
                        sx={{mt: 0.5, '--LinearProgress-thickness': '4px', borderRadius: 6}}
                        aria-label="Progress"
                        aria-valuenow={determinate ? progress : undefined}
                        aria-valuemin={determinate ? 0 : undefined}
                        aria-valuemax={determinate ? 100 : undefined}
                    />
                )}
            </Stack>
        </Alert>
    );
};
