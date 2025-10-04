import {Box, Sheet, Tab, TabList, TabPanel, Tabs} from '@mui/joy';
import {useState} from 'react';
import WeekPlan from "./components/week_plan/WeekPlan.tsx";
import SearchComponents from "./components/week_plan/SearchComponents.tsx";
import EditComponents from "./components/week_plan/EditComponents.tsx";
import ActionButton from "../../shared/components/ui/ActionButton.tsx";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SaveIcon from '@mui/icons-material/Save';

function MealPlan() {
    const [includeWeekend, setIncludeWeekend] = useState(true);

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
                    <WeekPlan includeWeekend={includeWeekend}/>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            mt: 4
                        }}
                    >
                        <SearchComponents/>
                        <EditComponents
                            includeWeekend={includeWeekend}
                            onToggleWeekend={setIncludeWeekend}
                        />
                    </Box><Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        gap: 2
                    }}
                >
                    <ActionButton
                        color={'warning'}
                        variant={'solid'}
                        icon={<OpenInNewIcon sx={{fontSize: '20px'}}/>}
                        onClick={() => {
                            console.log('Shopping List Exported')
                        }}
                        style={{
                            height: '50px',
                            padding: '0 15px',
                            boxShadow: '0px 10px 18px rgba(0, 0, 0, 0.5)'
                        }}
                        tooltip={'Export Selected Meals to Shopping List'}
                    />
                    <ActionButton
                        color={'success'}
                        variant={'solid'}
                        icon={<SaveIcon sx={{fontSize: '20px'}}/>}
                        onClick={() => {
                            console.log('Shopping List Exported')
                        }}
                        style={{
                            height: '50px',
                            padding: '0 15px',
                            boxShadow: '0px 10px 18px rgba(0, 0, 0, 0.5)'
                        }}
                    />

                </Box>
                </TabPanel>
                <TabPanel value={1}>

                </TabPanel>
            </Tabs>
        </Sheet>
    );
}

export default MealPlan;
