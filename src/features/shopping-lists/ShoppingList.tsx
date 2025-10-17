import {Box, Card, Sheet, Typography} from '@mui/joy';
import ListCard from "./ListCard.tsx";
import {useState} from "react";
import ButtonRow from "./ButtonRow.tsx";
import {useScrollShadows} from "../../shared/hooks/useScrollShadows.ts";
import {gradientGlowBorderStyle} from "../../shared/utils/cardStyles.ts";
import {DeletableItem, DeleteModeProvider} from "../../shared/components/ui/DeleteModeProvider.tsx";

function ShoppingList() {
    const [shoppingLists, setShoppingLists] = useState([
        {id: 1, name: 'Groceries'},
        {id: 2, name: 'Electronics'},
        {id: 3, name: 'Clothing'},
        {id: 4, name: 'Household Items'},
        {id: 5, name: 'Books'},
        {id: 6, name: 'Toys'},
        {id: 7, name: 'Sports Equipment'},
        {id: 8, name: 'Garden Supplies'},
        {id: 9, name: 'Pet Supplies'},
        {id: 10, name: 'Pharmacy Items'},
        {id: 11, name: 'Office Supplies'},
        {id: 12, name: 'Miscellaneous'},
        {id: 13, name: 'Groceries'},
        {id: 14, name: 'Electronics'},
        {id: 15, name: 'Clothing'},
        {id: 16, name: 'Household Items'},
        {id: 17, name: 'Books'},
        {id: 18, name: 'Toys'},
        {id: 19, name: 'Sports Equipment'},
        {id: 20, name: 'Garden Supplies'},
        {id: 21, name: 'Pet Supplies'},
        {id: 22, name: 'Pharmacy Items'},
        {id: 23, name: 'Office Supplies'},
        {id: 24, name: 'Miscellaneous'},
    ]);

    const {scrollRef, showTopShadow, showBottomShadow, handleScroll} = useScrollShadows();
    const [searchTerm, setSearchTerm] = useState('');
    const filteredLists = shoppingLists.filter(list =>
        list.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: number) => {
        setShoppingLists(prev => prev.filter(list => list.id !== id));
    };

    return (
        <>
            <Sheet
                sx={{
                    width: '100%',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >
                <DeleteModeProvider>
                    <Box
                        className="shopping-list-container"
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography level={'h1'}>
                            Shopping Lists
                        </Typography>
                        <Typography level={'body-lg'}>
                            Click on a list to open it on the right. By default, the current week's list is shown.
                        </Typography>
                        <ButtonRow
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                        <Box
                            sx={{
                                flex: 1,
                                borderRadius: 'var(--border-radius)',
                                backgroundColor: 'var(--primary-color)',
                                mt: 1,
                                position: 'relative',
                                boxShadow: 'inset 0 0 24px rgba(0, 0, 0, 0.1)',
                                overflow: 'hidden'
                            }}
                        >
                            <Box
                                ref={scrollRef}
                                onScroll={handleScroll}
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    px: 5,
                                    py: 2,
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.625,
                                }}
                            >
                                {filteredLists.map(list => (
                                    <DeletableItem
                                        key={list.id}
                                        onDelete={() => handleDelete(list.id)}
                                        itemId={list.id}
                                        deleteButtonPosition='top-right'
                                    >
                                        <Card
                                            variant="solid"
                                            sx={{
                                                ...gradientGlowBorderStyle,
                                                padding: '10px 15px',
                                                flexGrow: 1,
                                                minHeight: 'min-content',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': {
                                                    transform: 'scale(1.06)',
                                                    boxShadow: '0 0 15px hsl(280, 20%, 20%, 0.6)',
                                                    zIndex: 5,
                                                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                                },
                                                '&:active': {
                                                    transform: 'scale(1.03)',
                                                    transition: 'all 0.05s cubic-bezier(0.4, 0, 0.2, 1)',
                                                },
                                            }}
                                        >
                                            <Typography level="body-lg">
                                                {list.name}
                                            </Typography>
                                        </Card>
                                    </DeletableItem>
                                ))}
                            </Box>

                            {/* Top shadow */}
                            <Box
                                aria-hidden
                                sx={{
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '20px',
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), transparent)',
                                    opacity: showTopShadow ? 1 : 0,
                                    transition: 'opacity 0.3s ease',
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                    borderRadius: 'var(--border-radius) var(--border-radius) 0 0',
                                }}
                            />

                            {/* Bottom shadow */}
                            <Box
                                aria-hidden
                                sx={{
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '20px',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.15), transparent)',
                                    opacity: showBottomShadow ? 1 : 0,
                                    transition: 'opacity 0.3s ease',
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                    borderRadius: '0 0 var(--border-radius) var(--border-radius)',
                                }}
                            />
                        </Box>
                    </Box>
                </DeleteModeProvider>
                <Box
                    sx={{
                        flexShrink: 1,
                        p: 2
                    }}
                >
                    <ListCard/>
                </Box>
            </Sheet>
        </>
    );
}

export default ShoppingList;
