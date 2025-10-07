import {Button, Stack, Switch} from '@mui/joy';
import Typography from '@mui/joy/Typography';

interface EditComponentsProps {
    includeWeekend: boolean;
    onToggleWeekend: (value: boolean) => void;
    onClearAll: () => void;
}

export default function EditComponents({includeWeekend, onToggleWeekend, onClearAll}: EditComponentsProps) {
    return (
        <Stack direction="row" spacing={2}>
            <Typography
                component="label"
                endDecorator={
                    <Switch
                        size="lg"
                        variant="outlined"
                        checked={includeWeekend}
                        onChange={(event) => onToggleWeekend(event.target.checked)}
                    />
                }
            >
                Include Weekend?
            </Typography>
            <Button
                variant="outlined"
                color="primary"
                onClick={onClearAll}
                sx={{
                    borderStyle: 'dashed',
                }}
            >
                Clear All
            </Button>
        </Stack>
    );
}
