import WeeklyMealPlanner from '../components/ui/WeeklyMealPlanner'
import {Box} from '@mui/joy'

export const HomePage = () => {
    return (
        <Box sx={{padding: 3}}>
            <WeeklyMealPlanner/>
        </Box>
    )
}
