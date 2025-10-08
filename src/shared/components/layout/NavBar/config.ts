import type {NavItem} from './types';

export const NAV_ITEMS: readonly NavItem[] = [
    {id: 'dashboard', label: 'Dashboard', path: '/', icon: 'chart'},
    {id: 'meal-plan', label: 'Meal Plan', path: '/meal-plan', icon: 'calender'},
    {id: 'recipes', label: 'Recipes', path: '/recipes', icon: 'book'},
    {id: 'pantry', label: 'Pantry', path: '/pantry', icon: 'grocery-shelf'},
] as const;

const PATH_TO_ID_MAP: Record<string, string> = Object.fromEntries(
    NAV_ITEMS.map(item => [item.path, item.id])
);

export const getActiveItemFromPath = (pathname: string): string => {
    if (PATH_TO_ID_MAP[pathname]) {
        return PATH_TO_ID_MAP[pathname];
    }

    // Find the longest matching prefix (excluding root)
    const matchingPath = Object.keys(PATH_TO_ID_MAP)
        .filter(path => path !== '/')
        .sort((a, b) => b.length - a.length)
        .find(path => pathname.startsWith(path));

    return matchingPath ? PATH_TO_ID_MAP[matchingPath] : 'dashboard';
};

