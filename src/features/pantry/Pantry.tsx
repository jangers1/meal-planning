import {Box, Button, Sheet, Stack, Typography} from '@mui/joy';
import PantryMasonry from './masonry/PantryMasonry';
import {DeleteModeProvider} from '../../shared/components/ui/DeleteModeProvider';
import {useDeleteMode} from '../../shared/hooks/useDeleteMode';
import {useState} from 'react';

function PantrySection({
                           title,
                           items,
                           color,
                           onDeleteItem
                       }: {
    title: string;
    items: Array<{ id: string; title: string; quantity: number; date: Date }>;
    color: 'primary' | 'success';
    onDeleteItem: (id: string) => void;
}) {
    const {isDeleteMode, setDeleteMode} = useDeleteMode();

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                }}
            >
                <Typography level="h1">
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
                        color={isDeleteMode ? 'success' : 'danger'}
                        onClick={() => setDeleteMode(!isDeleteMode)}
                    >
                        {isDeleteMode ? 'Done' : 'Remove Item'}
                    </Button>
                </Stack>
            </Box>
            <Box sx={{mb: 4}}>
                <PantryMasonry items={items} color={color} onDeleteItem={onDeleteItem}/>
            </Box>
        </>
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
        <Sheet sx={{p: 2, width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <DeleteModeProvider>
                <PantrySection
                    title="Fridge"
                    items={fridgeItems}
                    color="primary"
                    onDeleteItem={handleDeleteFridgeItem}
                />
            </DeleteModeProvider>

            <DeleteModeProvider>
                <PantrySection
                    title="Freezer"
                    items={freezerItems}
                    color="success"
                    onDeleteItem={handleDeleteFreezerItem}
                />
            </DeleteModeProvider>
        </Sheet>
    );
}

export default Pantry;
