import {useState} from 'react';
import {Box, IconButton, Input, Textarea} from "@mui/joy";
import ChipManager from "./ChipManager.tsx";
import {type ChipData} from "./ChipCreateForm.tsx";
import Stack from "@mui/joy/Stack";
import { DeleteRounded } from "@mui/icons-material";
import ServingSelector from "./ServingSelector.tsx";

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
    const [description, setDescription] = useState('');

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
                        <DeleteRounded/>
                    </IconButton>
                </Stack>

                <Stack
                    direction={'row'}
                    spacing={2}
                >
                    <Textarea
                        placeholder="Enter recipe description..."
                        size='sm'
                        minRows={2}
                        maxRows={2}
                        variant={description ? "soft" : "outlined"}
                        color="primary"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        sx={{
                            flex: 1
                        }}
                    />

                    <IconButton
                        variant={'outlined'}
                        color={'primary'}
                        sx={{
                            borderStyle: 'dashed',
                            px: 1
                        }}
                        onClick={() => {
                            setDescription('')
                        }}
                    >
                        <DeleteRounded/>
                    </IconButton>
                </Stack>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <ChipManager
                        chips={recipeTags}
                        onChipsChange={setRecipeTags}
                        availableTags={availableTags}
                        onNewTagCreated={handleNewTagCreated}
                    />
                    <ServingSelector/>
                </Box>
            </Stack>
        </>
    )
}

export default RecipeHeaderInput;