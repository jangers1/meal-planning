import {Sheet, Typography} from '@mui/joy';
import ListCard from './ListCard';

function ShoppingList() {
    return (
        <>
            <Sheet
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography level="h1" sx={{ fontFamily: '"Roboto", sans-serif' }}>
                    Interactive Todo List
                </Typography>
                <ListCard />
            </Sheet>
        </>
    );
}

export default ShoppingList;
