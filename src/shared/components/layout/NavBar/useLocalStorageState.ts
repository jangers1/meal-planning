import {useCallback, useState} from 'react';
import {useAlerts} from '../../ui/alerts/AlertProvider.tsx';

export const useLocalStorageState = (key: string, defaultValue: boolean): readonly [boolean, (newValue: boolean | ((prev: boolean) => boolean)) => void] => {
    const [value, setValue] = useState<boolean>(() => {
        // Always return the default value on initial load (ignore localStorage)
        return defaultValue;
    });

    const alerts = useAlerts();

    const setStoredValue = useCallback((newValue: boolean | ((prev: boolean) => boolean)) => {
        const valueToStore = typeof newValue === 'function' ? newValue(value) : newValue;
        setValue(valueToStore);

        try {
            localStorage.setItem(key, String(valueToStore));
        } catch {
            alerts.pushError('Failed to save navigation state');
        }
    }, [key, alerts, value]);

    return [value, setStoredValue] as const;
};
