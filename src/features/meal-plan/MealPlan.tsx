import {Sheet, Tab, TabList, TabPanel, Tabs} from '@mui/joy';
import WeekPlan from "../../shared/components/ui/WeekPlan.tsx";

function MealPlan() {

    return (
        <Sheet
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Tabs
                size={'lg'}
            >
                <TabList>
                    <Tab color={'neutral'}>Week Plan</Tab>
                    <Tab color={'neutral'}>Month Overview</Tab>
                </TabList>
                <TabPanel value={0} sx={{p: 0}}>
                    <WeekPlan/>
                </TabPanel>
                <TabPanel value={1}>

                </TabPanel>
            </Tabs>
        </Sheet>
    );
}

export default MealPlan;
