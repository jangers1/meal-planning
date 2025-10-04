import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Input,
    Modal,
    ModalDialog,
    Sheet,
    Tab,
    TabList,
    TabPanel,
    Tabs
} from '@mui/joy';
import {useState} from 'react';
import WeekPlan from "./components/week_plan/WeekPlan.tsx";
import SearchComponents from "./components/week_plan/SearchComponents.tsx";
import EditComponents from "./components/week_plan/EditComponents.tsx";
import ActionButton from "../../shared/components/ui/ActionButton.tsx";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SaveIcon from '@mui/icons-material/Save';
import RecipeContainer from "./components/week_plan/RecipeContainer.tsx";

interface GenericRecipe {
    id: number;
    title: string;
}

function MealPlan() {
    const [includeWeekend, setIncludeWeekend] = useState(true);
    const [genericRecipes, setGenericRecipes] = useState<GenericRecipe[]>([]);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newRecipeName, setNewRecipeName] = useState('');

    const handleCreateGenericClick = () => {
        setNewRecipeName(`Generic Recipe ${genericRecipes.length + 1}`);
        setShowCreateDialog(true);
    };

    const handleCreateGeneric = () => {
        if (newRecipeName.trim()) {
            const newGeneric: GenericRecipe = {
                id: Date.now(),
                title: newRecipeName.trim()
            };
            setGenericRecipes(prev => [...prev, newGeneric]);
        }
        setShowCreateDialog(false);
        setNewRecipeName('');
    };

    const handleCancelCreate = () => {
        setShowCreateDialog(false);
        setNewRecipeName('');
    };

    const handleDeleteGeneric = (id: number) => {
        setGenericRecipes(prev => prev.filter(recipe => recipe.id !== id));
    };

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
                sx={{
                    flex: 1
                }}
            >
                <TabList>
                    <Tab color={'neutral'}>Week Plan</Tab>
                    <Tab color={'neutral'}>Month Overview</Tab>
                </TabList>
                <TabPanel value={0} sx={{p: 0, display: 'flex', flexDirection: 'column'}}>
                    <WeekPlan includeWeekend={includeWeekend}/>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            mt: 4
                        }}
                    >
                        <SearchComponents onCreateGeneric={handleCreateGenericClick}/>
                        <EditComponents
                            includeWeekend={includeWeekend}
                            onToggleWeekend={setIncludeWeekend}
                        />
                    </Box>
                    <RecipeContainer
                        genericRecipes={genericRecipes}
                        onDeleteGeneric={handleDeleteGeneric}
                    />
                    <Box
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

            {/* Create Generic Recipe Dialog */}
            <Modal open={showCreateDialog} onClose={handleCancelCreate}>
                <ModalDialog>
                    <DialogTitle>Create Generic Recipe</DialogTitle>
                    <DialogContent>
                        <Input
                            placeholder="Enter recipe name"
                            value={newRecipeName}
                            onChange={(e) => setNewRecipeName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleCreateGeneric();
                                }
                            }}
                            sx={{mt: 1}}
                            autoFocus
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="primary" onClick={handleCreateGeneric}
                                disabled={!newRecipeName.trim()}>
                            Create
                        </Button>
                        <Button variant="plain" color="neutral" onClick={handleCancelCreate}>
                            Cancel
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </Sheet>
    );
}

export default MealPlan;
