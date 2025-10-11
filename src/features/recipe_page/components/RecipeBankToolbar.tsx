import {Box, Button, IconButton, Input, Switch} from "@mui/joy";
import TuneIcon from '@mui/icons-material/TuneRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';

interface RecipeBankToolbarProps {
    searchMode: 'title' | 'tags';
    searchString: string;
    sidePanelOpen: boolean;
    isDeleteMode: boolean;
    onSearchModeChange: () => void;
    onSearchChange: (value: string) => void;
    onCreateRecipe: () => void;
    onToggleDeleteMode: () => void;
    onToggleSidePanel: () => void;
}

export function RecipeBankToolbar({
    searchMode,
    searchString,
    sidePanelOpen,
    isDeleteMode,
    onSearchModeChange,
    onSearchChange,
    onCreateRecipe,
    onToggleDeleteMode,
    onToggleSidePanel
}: RecipeBankToolbarProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
            }}
        >
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <Switch
                    variant={'outlined'}
                    size={'lg'}
                    checked={searchMode === 'tags'}
                    onChange={onSearchModeChange}
                    slotProps={{input: {'aria-label': 'Toggle search mode: tags or titles'}}}
                />
            </Box>
            <Input
                placeholder={searchMode === 'tags' ? "Search tags..." : "Search recipe titles..."}
                color="primary"
                variant={searchString ? "soft" : "outlined"}
                sx={{flex: 1}}
                value={searchString}
                onChange={(e) => onSearchChange(e.target.value)}
                endDecorator={
                    searchString && (
                        <IconButton
                            variant={'plain'}
                            color={'primary'}
                            onClick={() => onSearchChange('')}
                            aria-label="Clear search"
                        >
                            <CloseRounded/>
                        </IconButton>
                    )
                }
            />
            <Button
                variant={'solid'}
                color={'primary'}
                onClick={onCreateRecipe}
            >
                Create Recipe
            </Button>
            <Button
                variant={'solid'}
                color={isDeleteMode ? 'success' : 'danger'}
                onClick={onToggleDeleteMode}
            >
                {isDeleteMode ? 'Confirm' : 'Delete Recipes'}
            </Button>
            <Button
                variant="outlined"
                color="neutral"
                startDecorator={<TuneIcon/>}
                onClick={onToggleSidePanel}
            >
                {sidePanelOpen ? 'Hide filters' : 'Change filters'}
            </Button>
        </Box>
    );
}

