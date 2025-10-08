import {Button, Stack, Switch} from '@mui/joy';
import Typography from '@mui/joy/Typography';
import {useDeleteMode} from '../../../../shared/hooks/useDeleteMode';
import {useEffect} from 'react';

interface EditComponentsProps {
    includeWeekend: boolean;
    onToggleWeekend: (value: boolean) => void;
    onClearAll: () => void;
    hasRecipesInSlots: boolean;
}

export default function EditComponents({includeWeekend, onToggleWeekend, onClearAll, hasRecipesInSlots}: EditComponentsProps) {
    const {isDeleteMode, setDeleteMode} = useDeleteMode();

    // Automatically exit delete mode when there are no recipes left
    useEffect(() => {
        if (isDeleteMode && !hasRecipesInSlots) {
            setDeleteMode(false);
        }
    }, [hasRecipesInSlots, isDeleteMode, setDeleteMode]);

    return (
        <Stack direction="row" spacing={2}>
            <Typography
                component="label"
                endDecorator={
                    <Switch
                        size="lg"
                        variant="solid"
                        checked={includeWeekend}
                        onChange={(event) => onToggleWeekend(event.target.checked)}
                    />
                }
            >
                Include Weekend?
            </Typography>
            <Button
                variant="soft"
                color={isDeleteMode ? 'success' : 'primary'}
                onClick={() => setDeleteMode(!isDeleteMode)}
                disabled={!hasRecipesInSlots}
                sx={{
                    borderStyle: 'dashed',
                    borderColor: hasRecipesInSlots ? 'var(--joy-palette-primary-500)' : 'rgba(0,0,0,0.2)'
                }}
            >
                {isDeleteMode ? 'Done Deleting' : 'Toggle Delete'}
            </Button>
            <Button
                variant="soft"
                color="primary"
                onClick={onClearAll}
                disabled={!hasRecipesInSlots}
                sx={{
                    borderStyle: 'dashed',
                    borderColor: hasRecipesInSlots ? 'var(--joy-palette-primary-500)' : 'rgba(0,0,0,0.2)'
                }}
            >
                Clear All
            </Button>
        </Stack>
    );
}
