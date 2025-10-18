import {Box, Button, Sheet, Stack, Tab, TabList, TabPanel, Tabs, Typography} from '@mui/joy';
import PantryMasonry from './masonry/PantryMasonry';
import {DeleteModeProvider} from '../../shared/components/ui/DeleteModeProvider';
import {useDeleteMode} from '../../shared/hooks/useDeleteMode';
import {useScrollShadows} from '../../shared/hooks/useScrollShadows';
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
    const {scrollRef, showTopShadow, showBottomShadow, handleScroll} = useScrollShadows();

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
            <Box
                sx={{
                    flex: 1,
                    borderRadius: 5,
                    backgroundColor: 'var(--joy-palette-neutral-softBg)',
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
                        p: 2,
                        overflowY: 'auto',
                    }}
                >
                    <PantryMasonry items={items} color={color} onDeleteItem={onDeleteItem}/>
                </Box>

                {/* Top shadow */}
                <Box
                    aria-hidden
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 18,
                        pointerEvents: 'none',
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0))',
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        zIndex: 2,
                        opacity: showTopShadow ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                    }}
                />

                {/* Bottom shadow */}
                <Box
                    aria-hidden
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 20,
                        pointerEvents: 'none',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.22), rgba(0,0,0,0))',
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                        zIndex: 2,
                        opacity: showBottomShadow ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                    }}
                />
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
        {id: 'f7', title: 'Cheese Slices', quantity: 4, date: new Date()},
        {id: 'f8', title: 'Veggie Wraps', quantity: 6, date: new Date()},
        {id: 'f9', title: 'Smoothie Packs', quantity: 2, date: new Date()},
        {id: 'f10', title: 'Deli Meats', quantity: 5, date: new Date()},
        {id: 'f11', title: 'Hard-Boiled Eggs', quantity: 12, date: new Date()},
        {id: 'f12', title: 'Fresh Juice', quantity: 3, date: new Date()},
        {id: 'f13', title: 'Leftover Pizza', quantity: 1, date: new Date()},
        {id: 'f14', title: 'Grilled Vegetables', quantity: 4, date: new Date()}
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
