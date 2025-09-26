import {useState} from 'react';
import {Box, IconButton, Input} from "@mui/joy";
import ChipManager from "./ChipManager.tsx";
import {type ChipData} from "./ChipCreateForm.tsx";
import CloseIcon from '@mui/icons-material/Close';
import Stack from "@mui/joy/Stack";

function RecipeHeaderInput() {
    const [recipeTags, setRecipeTags] = useState<ChipData[]>([]);
    const [availableTags, setAvailableTags] = useState<ChipData[]>([
        // Some default tags to start with
        {text: 'Quick', color: 'success'},
        {text: 'Vegetarian', color: 'primary'},
        {text: 'Spicy', color: 'danger'},
        {text: 'Healthy', color: 'success'},
        {text: 'Comfort Food', color: 'warning'},
        {text: 'Holiday', color: 'primary'},
        {text: 'Budget-Friendly', color: 'neutral'}
    ]);
    const [title, setTitle] = useState('');

    const handleNewTagCreated = (newTag: ChipData) => {
        // Add the new tag to available tags if it doesn't already exist
        if (!availableTags.some(tag => tag.text === newTag.text)) {
            setAvailableTags(prev => [...prev, newTag]);
        }
    };

    return (
        <>
            <Stack
                direction={'column'}
                spacing={2}
            >
                <Stack
                    direction={'row'}
                    spacing={2}
                >
                    <Input
                        placeholder={'Enter Recipe Title'}
                        variant={title ? "soft" : "outlined"}
                        size="lg"
                        color={'primary'}
                        sx={{
                            flex: 1
                        }}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <IconButton
                        variant={'outlined'}
                        color={'primary'}
                        sx={{
                            borderStyle: 'dashed',
                            px: 1
                        }}
                        onClick={() => {
                            setTitle('')
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </Stack>

                <Box>
                    <ChipManager
                        chips={recipeTags}
                        onChipsChange={setRecipeTags}
                        availableTags={availableTags}
                        onNewTagCreated={handleNewTagCreated}
                    />
                </Box>
            </Stack>
        </>
    )
}

export default RecipeHeaderInput;