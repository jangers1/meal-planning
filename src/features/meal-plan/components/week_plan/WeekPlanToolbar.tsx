import {Box} from '@mui/joy';
import SearchComponents from './SearchComponents';
import EditComponents from './EditComponents';

interface WeekPlanToolbarProps {
    includeWeekend: boolean;
    onToggleWeekend: (value: boolean) => void;
    onCreateGeneric: () => void;
    onClearAll: () => void;
}

export default function WeekPlanToolbar({
                                            includeWeekend,
                                            onToggleWeekend,
                                            onCreateGeneric,
                                            onClearAll,
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
            <SearchComponents onCreateGeneric={onCreateGeneric}/>
            <EditComponents
                includeWeekend={includeWeekend}
                onToggleWeekend={onToggleWeekend}
                onClearAll={onClearAll}
            />
        </Box>
    );
}
