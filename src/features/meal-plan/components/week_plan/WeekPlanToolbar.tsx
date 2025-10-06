import {Box} from '@mui/joy';
import SearchComponents from './SearchComponents';
import EditComponents from './EditComponents';

interface WeekPlanToolbarProps {
    includeWeekend: boolean;
    onToggleWeekend: (value: boolean) => void;
    onCreateGeneric: () => void;
}

export default function WeekPlanToolbar({
    includeWeekend,
    onToggleWeekend,
    onCreateGeneric,
}: WeekPlanToolbarProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                mt: 4,
            }}
        >
            <SearchComponents onCreateGeneric={onCreateGeneric} />
            <EditComponents includeWeekend={includeWeekend} onToggleWeekend={onToggleWeekend} />
        </Box>
    );
}

