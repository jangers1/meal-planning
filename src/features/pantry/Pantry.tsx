import {Box, Sheet, Typography} from '@mui/joy';
import PantryMasonry from './masonry/PantryMasonry';

function Pantry() {
    // Example data; replace with real data source later
    const fridgeItems = [
        {id: 'f1', title: 'Chicken Curry', quantity: 5, date: new Date()},
        {id: 'f2', title: 'Salad Bowl', quantity: 2, date: new Date()},
        {id: 'f3', title: 'Pasta Bolognese', quantity: 7, date: new Date()},
        {id: 'f4', title: 'Fruit Mix', quantity: 1, date: new Date()},
        {id: 'f5', title: 'Soup Jar', quantity: 3, date: new Date()},
        {id: 'f6', title: 'Yogurt Cups', quantity: 9, date: new Date()},
    ];

    const freezerItems = [
        {id: 'z1', title: 'Lasagna Portions', quantity: 6, date: new Date()},
        {id: 'z2', title: 'Frozen Berries', quantity: 2, date: new Date()},
        {id: 'z3', title: 'Dumplings', quantity: 4, date: new Date()},
        {id: 'z4', title: 'Ice Cream', quantity: 1, date: new Date()},
        {id: 'z5', title: 'Veggie Burgers', quantity: 3, date: new Date()},
        {id: 'z6', title: 'Fish Fillets', quantity: 8, date: new Date()},
    ];

    return (
        <Sheet sx={{p: 2, width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Typography level="h1" sx={{mb: 2}}>Fridge</Typography>
            <Box sx={{mb: 4}}>
                <PantryMasonry items={fridgeItems} color="primary"/>
            </Box>

            <Typography level="h1" sx={{mb: 2}}>Freezer</Typography>
            <Box>
                <PantryMasonry items={freezerItems} color="success"/>
            </Box>
        </Sheet>
    );
}

export default Pantry;
