import {Sheet, Tab, TabList, TabPanel, Tabs} from '@mui/joy';
import WeekPlanTab from './components/week_plan/WeekPlanTab';
import useRecipeManager from './hooks/useRecipeManager';
import Calender from "./components/month_overview/Calender.tsx";

function MealPlan() {
    const {
        genericRecipes,
        preppedMeals,
        recipes,
        isLoading,
        createGenericRecipe,
        deleteGenericRecipe,
    } = useRecipeManager();

    return (
        <Sheet
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Tabs size="lg" sx={{flex: 1}}>
                <TabList>
                    <Tab color="primary">Week Plan</Tab>
                    <Tab color="primary">Month Overview</Tab>
                </TabList>

                <TabPanel value={0} sx={{p: 0, flex: 1, minHeight: 0}}>
                    <WeekPlanTab
                        genericRecipes={genericRecipes}
                        preppedMeals={preppedMeals}
                        recipes={recipes}
                        isLoading={isLoading}
                        onCreateGeneric={createGenericRecipe}
                        onDeleteGeneric={deleteGenericRecipe}
                    />
                </TabPanel>

                <TabPanel value={1} sx={{p: 0, flex: 1, minHeight: 0}}>
                    <Calender/>
                </TabPanel>
            </Tabs>
        </Sheet>
    );
}

export default MealPlan;
