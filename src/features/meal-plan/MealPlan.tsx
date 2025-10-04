import {Box, Sheet, Tab, TabList, TabPanel, Tabs} from '@mui/joy';
import WeekPlan from "./WeekPlan.tsx";
import SearchComponents from "./SearchComponents.tsx";
import EditComponents from "./EditComponents.tsx";
import ActionButton from "../../shared/components/ui/ActionButton.tsx";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SaveIcon from '@mui/icons-material/Save';

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
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            mt: 4
                        }}
                    >
                        <SearchComponents/>
                        <EditComponents/>
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
