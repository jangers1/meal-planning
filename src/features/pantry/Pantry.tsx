import {Box, Button, Sheet, Stack, Tab, TabList, TabPanel, Tabs, Typography} from '@mui/joy';
import PantryMasonry from './masonry/PantryMasonry';
import {DeleteModeProvider} from '../../shared/components/ui/DeleteModeProvider';
import {useDeleteMode} from '../../shared/hooks/useDeleteMode';
import {useState} from 'react';

function PantryTabContent({
                              items,
                              title,
                              color,
                              onDeleteItem
                          }: {
    items: Array<{ id: string; title: string; quantity: number; date: Date }>;
    title: string;
    color: 'primary' | 'success';
    onDeleteItem: (id: string) => void;
}) {
    const {isDeleteMode, setDeleteMode} = useDeleteMode();

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100%', p: 2}}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                }}
            >
                <Typography level={'h1'}>
                    {title}
                </Typography>
                <Stack
                    direction="row"
                    spacing={2}
                >
                    <Button>
                        Add Item
                    </Button>
                    <Button
                        size={'sm'}
                        color={isDeleteMode ? 'success' : 'danger'}
                        onClick={() => setDeleteMode(!isDeleteMode)}
                    >
                        {isDeleteMode ? 'Done' : 'Remove Item'}
                    </Button>
                </Stack>
            </Box>
            <Box sx={{flex: 1, minHeight: 0}}>
                <PantryMasonry items={items} color={color} onDeleteItem={onDeleteItem}/>
            </Box>
        </Box>
    );
}

function Pantry() {
    // Example data; replace with real data source later
    const [fridgeItems, setFridgeItems] = useState([
        {id: 'f1', title: 'Chicken Curry', quantity: 5, date: new Date()},
        {id: 'f2', title: 'Salad Bowl', quantity: 2, date: new Date()},
        {id: 'f3', title: 'Pasta Bolognese', quantity: 7, date: new Date()},
        {id: 'f4', title: 'Fruit Mix', quantity: 1, date: new Date()},
        {id: 'f5', title: 'Soup Jar', quantity: 3, date: new Date()},
        {id: 'f6', title: 'Yogurt Cups', quantity: 9, date: new Date()},
    ]);

    const [freezerItems, setFreezerItems] = useState([
        {id: 'z1', title: 'Lasagna Portions', quantity: 6, date: new Date()},
        {id: 'z2', title: 'Frozen Berries', quantity: 2, date: new Date()},
        {id: 'z3', title: 'Dumplings', quantity: 4, date: new Date()},
        {id: 'z4', title: 'Ice Cream', quantity: 1, date: new Date()},
        {id: 'z5', title: 'Veggie Burgers', quantity: 3, date: new Date()},
        {id: 'z6', title: 'Fish Fillets', quantity: 8, date: new Date()},
    ]);

    const handleDeleteFridgeItem = (id: string) => {
        setFridgeItems(prev => prev.filter(item => item.id !== id));
    };

    const handleDeleteFreezerItem = (id: string) => {
        setFreezerItems(prev => prev.filter(item => item.id !== id));
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
            <Tabs size="lg" sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <TabList>
                    <Tab color="primary">Fridge</Tab>
                    <Tab color="success">Freezer</Tab>
                </TabList>

                <TabPanel value={0} sx={{p: 0, flex: 1, minHeight: 0}}>
                    <DeleteModeProvider>
                        <PantryTabContent
                            items={fridgeItems}
                            title={'Fridge'}
                            color="primary"
                            onDeleteItem={handleDeleteFridgeItem}
                        />
                    </DeleteModeProvider>
                </TabPanel>

                <TabPanel value={1} sx={{p: 0, flex: 1, minHeight: 0}}>
                    <DeleteModeProvider>
                        <PantryTabContent
                            items={freezerItems}
                            title={'Freezer'}
                            color="success"
                            onDeleteItem={handleDeleteFreezerItem}
                        />
                    </DeleteModeProvider>
                </TabPanel>
            </Tabs>
        </Sheet>
    );
}

export default Pantry;
