import {Sheet, Tab, TabList, TabPanel, Tabs} from '@mui/joy';
import WeekPlanTab from './components/week_plan/WeekPlanTab';
import useRecipeManager from './hooks/useRecipeManager';

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

                <TabPanel value={0} sx={{p: 0, display: 'flex', flexDirection: 'column'}}>
                    <WeekPlanTab
                        genericRecipes={genericRecipes}
                        prepedMeals={preppedMeals}
                        recipes={recipes}
                        isLoading={isLoading}
                        onCreateGeneric={createGenericRecipe}
                        onDeleteGeneric={deleteGenericRecipe}
                    />
                </TabPanel>

                <TabPanel value={1}>
                    {/* Month overview implementation goes here */}
                </TabPanel>
            </Tabs>
        </Sheet>
    );
}

export default MealPlan;
