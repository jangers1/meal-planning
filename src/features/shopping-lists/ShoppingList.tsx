import {Sheet, Typography} from '@mui/joy';

function ShoppingList() {
    return (
        <Sheet sx={{p:2, width: '100%'}}>
            <Typography level="h3">Shopping List</Typography>
            <Typography level="body-md" sx={{mt:1}}>This is where shopping lists will sit</Typography>
        </Sheet>
    );
}

export default ShoppingList;
