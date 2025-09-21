import React, {useEffect, useRef, useState} from 'react';
import {Box, Button, Card, List, ListItem, ListItemButton, Typography} from '@mui/joy';
import {KeyboardArrowDown, KeyboardArrowRight} from '@mui/icons-material';

export interface CategoryItem {
    id: string;
    name: string;
    subCategories?: CategoryItem[];
}

interface CategorySelectionProps {
    categories: CategoryItem[];
}

// Constants
const MAX_DROPDOWN_LEVELS = 5;
const SUBMENU_WIDTH = 200;
const SUBMENU_MAX_HEIGHT = 300;

function CategorySelection({categories}: CategorySelectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [openDropdowns, setOpenDropdowns] = useState<boolean[]>(
        Array.from({length: MAX_DROPDOWN_LEVELS}, () => false)
    );
    const [selectedItems, setSelectedItems] = useState<(CategoryItem | null)[]>(
        Array.from({length: MAX_DROPDOWN_LEVELS}, () => null)
    );
    const [persistentSelectedPath, setPersistentSelectedPath] = useState<CategoryItem[]>([]);
    const [isMainMenuOpen, setIsMainMenuOpen] = useState<boolean>(false);
    const [submenuPositions, setSubmenuPositions] = useState<number[]>(
        Array.from({length: MAX_DROPDOWN_LEVELS}, () => 0)
    );
    const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Initialize dropdown refs array
    useEffect(() => {
        dropdownRefs.current = Array.from({length: MAX_DROPDOWN_LEVELS}, () => null);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isInsideAnyDropdown = dropdownRefs.current.some(ref =>
                ref && ref.contains(target)
            );

            if (!isInsideAnyDropdown) {
                closeAllDropdowns();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const closeAllDropdowns = () => {
        setIsMainMenuOpen(false);
        setOpenDropdowns(Array.from({length: MAX_DROPDOWN_LEVELS}, () => false));
        setSelectedItems(Array.from({length: MAX_DROPDOWN_LEVELS}, () => null));
    };

    const rebuildSelectedItems = (persistentPath: CategoryItem[]): (CategoryItem | null)[] => {
        const items: (CategoryItem | null)[] = Array.from({length: MAX_DROPDOWN_LEVELS}, () => null);
        persistentPath.forEach((item, index) => {
            items[index] = item;
        });
        return items;
    };

    const calculateSubmenuPosition = (event: React.MouseEvent, level: number) => {
        const clickedElement = event.currentTarget as HTMLElement;
        const mainContainer = dropdownRefs.current[0];

        if (mainContainer && clickedElement) {
            const containerRect = mainContainer.getBoundingClientRect();
            const itemRect = clickedElement.getBoundingClientRect();
            const itemCenter = itemRect.top + (itemRect.height / 2) - containerRect.top;

            const newPositions = [...submenuPositions];
            newPositions[level + 1] = itemCenter;
            setSubmenuPositions(newPositions);
        }
    };

    const handleItemSelection = (item: CategoryItem, level: number) => {
        const newSelectedItems = [...selectedItems];
        newSelectedItems[level] = item;

        const finalPath = newSelectedItems.slice(0, level + 1).filter(Boolean) as CategoryItem[];
        const categoryPath = finalPath.map(item => item.name).join(' → ');

        setSelectedCategory(categoryPath);
        setPersistentSelectedPath(finalPath);
        closeAllDropdowns();
    };

    const handleItemWithSubcategories = (item: CategoryItem, level: number, event: React.MouseEvent) => {
        calculateSubmenuPosition(event, level);

        const newSelectedItems = [...selectedItems];
        const newOpenDropdowns = [...openDropdowns];

        newSelectedItems[level] = item;

        if (level + 1 < MAX_DROPDOWN_LEVELS) {
            newOpenDropdowns[level + 1] = true;
        }

        // Close any dropdowns beyond the next level
        for (let i = level + 2; i < MAX_DROPDOWN_LEVELS; i++) {
            newOpenDropdowns[i] = false;
            newSelectedItems[i] = null;
        }

        setSelectedItems(newSelectedItems);
        setOpenDropdowns(newOpenDropdowns);
    };

    const handleItemClick = (item: CategoryItem, level: number, event?: React.MouseEvent) => {
        // Clear persistent path when user starts a new navigation
        if (persistentSelectedPath.length > 0) {
            setPersistentSelectedPath([]);
        }

        if (item.subCategories && item.subCategories.length > 0 && event) {
            handleItemWithSubcategories(item, level, event);
        } else {
            handleItemSelection(item, level);
        }
    };

    const handleMainButtonClick = () => {
        setIsMainMenuOpen(!isMainMenuOpen);

        if (!isMainMenuOpen) {
            if (persistentSelectedPath.length > 0) {
                // Restore the persistent path when reopening
                const restoredItems = rebuildSelectedItems(persistentSelectedPath);
                setSelectedItems(restoredItems);

                const newOpenDropdowns = Array.from({length: MAX_DROPDOWN_LEVELS}, () => false);
                for (let i = 1; i < persistentSelectedPath.length; i++) {
                    newOpenDropdowns[i] = true;
                }
                setOpenDropdowns(newOpenDropdowns);
            } else {
                // Reset state when opening main menu if no persistent path
                setOpenDropdowns(Array.from({length: MAX_DROPDOWN_LEVELS}, () => false));
                setSelectedItems(Array.from({length: MAX_DROPDOWN_LEVELS}, () => null));
            }
        }
    };

    const getItemsForLevel = (level: number): CategoryItem[] => {
        if (level === 0) {
            return categories;
        }
        return selectedItems[level - 1]?.subCategories || [];
    };

    const clearSelection = () => {
        setSelectedCategory('');
        setPersistentSelectedPath([]);
        closeAllDropdowns();
    };

    const isItemHighlighted = (item: CategoryItem, level: number): boolean => {
        const isInCurrentPath = selectedItems[level]?.id === item.id;
        const isInPersistentPath = persistentSelectedPath[level]?.id === item.id;
        return isInCurrentPath || isInPersistentPath;
    };

    const getItemButtonStyles = (item: CategoryItem, level: number) => {
        const isHighlighted = isItemHighlighted(item, level);

        return {
            display: 'flex',
            justifyContent: 'space-between',
            py: 1,
            px: 2,
            backgroundColor: isHighlighted ? 'primary.softBg' : 'transparent',
            color: isHighlighted ? 'primary.solidColor' : 'inherit',
            fontWeight: isHighlighted ? 'md' : 'normal',
            '&:hover': {
                backgroundColor: isHighlighted ? 'primary.softHoverBg' : 'background.level1'
            }
        };
    };

    const renderMenuItem = (item: CategoryItem, level: number) => (
        <ListItem key={item.id} sx={{p: 0}}>
            <ListItemButton
                onClick={(event) => handleItemClick(item, level, event)}
                sx={getItemButtonStyles(item, level)}
            >
                <Typography level="body-sm">{item.name}</Typography>
                {item.subCategories && item.subCategories.length > 0 && (
                    <KeyboardArrowRight sx={{fontSize: 16}}/>
                )}
            </ListItemButton>
        </ListItem>
    );

    const renderSubmenu = (level: number) => {
        const items = getItemsForLevel(level);

        if (!openDropdowns[level] || items.length === 0) return null;

        return (
            <Card
                key={level}
                data-dropdown-level={level}
                ref={(el: HTMLDivElement | null) => {
                    dropdownRefs.current[level] = el;
                }}
                sx={{
                    position: 'absolute',
                    top: submenuPositions[level] - 8,
                    left: SUBMENU_WIDTH + (level - 1) * SUBMENU_WIDTH,
                    p: 0,
                    minWidth: SUBMENU_WIDTH,
                    maxHeight: SUBMENU_MAX_HEIGHT,
                    overflow: 'auto',
                    zIndex: 1000 + level,
                    boxShadow: 'md'
                }}
            >
                <List sx={{p: 0}}>
                    {items.map((item) => renderMenuItem(item, level))}
                </List>
            </Card>
        );
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <Box sx={{position: 'relative', display: 'inline-block', width: 'fit-content'}}>
                <Box ref={(el: HTMLDivElement | null) => {
                    dropdownRefs.current[0] = el;
                }}>
                    <Button
                        variant={selectedCategory ? 'soft' : 'outlined'}
                        size={'md'}
                        endDecorator={<KeyboardArrowDown/>}
                        onClick={handleMainButtonClick}
                        sx={{minWidth: 150}}
                    >
                        {selectedCategory || 'Select Category'}
                    </Button>

                    {/* Main menu */}
                    {isMainMenuOpen && (
                        <Card
                            data-dropdown-level="0"
                            sx={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                mt: 1,
                                p: 0,
                                minWidth: SUBMENU_WIDTH,
                                maxHeight: SUBMENU_MAX_HEIGHT,
                                overflow: 'auto',
                                zIndex: 1000,
                                boxShadow: 'md'
                            }}
                        >
                            <List sx={{p: 0}}>
                                {categories.map((item) => renderMenuItem(item, 0))}
                            </List>
                        </Card>
                    )}

                    {/* Cascading submenus */}
                    {Array.from({length: 4}, (_, subLevel) =>
                        renderSubmenu(subLevel + 1)
                    )}
                </Box>
            </Box>

            <Button
                size="sm"
                variant="outlined"
                onClick={clearSelection}
                sx={{borderStyle: 'dashed'}}
            >
                Clear Selection
            </Button>
        </Box>
    );
}

export default CategorySelection;
