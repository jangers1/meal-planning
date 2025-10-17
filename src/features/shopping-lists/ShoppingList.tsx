import {Box, Card, Sheet, Typography} from '@mui/joy';
import ListCard from "./ListCard.tsx";
import {useState} from "react";
import './ShoppingList.css';
import ButtonRow from "./ButtonRow.tsx";
import {useScrollShadows} from "../../shared/hooks/useScrollShadows.ts";

function ShoppingList() {
    const [shoppingLists] = useState([
        {id: 1, name: 'Groceries', linkedList: null},
        {id: 2, name: 'Electronics', linkedList: null},
        {id: 3, name: 'Clothing', linkedList: null},
        {id: 4, name: 'Household Items', linkedList: null},
        {id: 5, name: 'Books', linkedList: null},
        {id: 6, name: 'Toys', linkedList: null},
        {id: 7, name: 'Sports Equipment', linkedList: null},
        {id: 8, name: 'Garden Supplies', linkedList: null},
        {id: 9, name: 'Pet Supplies', linkedList: null},
        {id: 10, name: 'Pharmacy Items', linkedList: null},
        {id: 11, name: 'Office Supplies', linkedList: null},
        {id: 12, name: 'Miscellaneous', linkedList: null},
        {id: 13, name: 'Groceries', linkedList: null},
        {id: 14, name: 'Electronics', linkedList: null},
        {id: 15, name: 'Clothing', linkedList: null},
        {id: 16, name: 'Household Items', linkedList: null},
        {id: 17, name: 'Books', linkedList: null},
        {id: 18, name: 'Toys', linkedList: null},
        {id: 19, name: 'Sports Equipment', linkedList: null},
        {id: 20, name: 'Garden Supplies', linkedList: null},
        {id: 21, name: 'Pet Supplies', linkedList: null},
        {id: 22, name: 'Pharmacy Items', linkedList: null},
        {id: 23, name: 'Office Supplies', linkedList: null},
        {id: 24, name: 'Miscellaneous', linkedList: null},
    ]);

    const {scrollRef, showTopShadow, showBottomShadow, handleScroll} = useScrollShadows();

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
                    <ButtonRow/>
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
                            {shoppingLists.map(list => (
                                <Card
                                    key={list.id}
                                    variant="solid"
                                    onClick={() => {console.log(`Open List ${list.linkedList}`)}}
                                    sx={{
                                        background: 'linear-gradient(45deg, hsl(280, 80%, 20%), hsl(310, 85%, 30%))',
                                        padding: '10px 20px',
                                        borderRadius: '15px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'scale(1.06)',
                                            filter: 'brightness(145%)',
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
                                    <Typography level="body-lg" sx={{color: 'white'}}>
                                        {list.name}
                                    </Typography>
                                </Card>
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
