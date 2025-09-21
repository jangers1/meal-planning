import {useState} from 'react';
import {Box, Button, Chip, ChipDelete, Stack} from '@mui/joy';
import {AddRounded} from '@mui/icons-material';
import ChipCreateForm, {type ChipData} from './ChipCreateForm.tsx';

interface ChipManagerProps {
    chips: ChipData[];
    onChipsChange: (chips: ChipData[]) => void;
    placeholder?: string;
    variant?: 'soft' | 'solid' | 'outlined' | 'plain';
    defaultColor?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning';
    chipSize?: 'sm' | 'md' | 'lg';
    buttonSize?: 'sm' | 'md' | 'lg';
    inputSize?: 'sm' | 'md' | 'lg';
    addButtonText?: string;
}

function ChipManager({
                         chips,
                         onChipsChange,
                         placeholder = "Enter text",
                         variant = 'soft',
                         defaultColor = 'primary',
                         chipSize = 'md',
                         buttonSize = 'md',
                         inputSize = 'md',
                         addButtonText = "Add"
                     }: ChipManagerProps) {
    const [isCreating, setIsCreating] = useState(false);

    const handleAddChip = (newChip: ChipData) => {
        if (newChip.text && !chips.some(chip => chip.text === newChip.text)) {
            onChipsChange([...chips, newChip]);
        }
        setIsCreating(false);
    };

    const handleDeleteChip = (chipToDelete: ChipData) => {
        onChipsChange(chips.filter(chip => chip.text !== chipToDelete.text));
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
    };

    return (
        <Box>
            <Stack direction="row" spacing={2} sx={{flexWrap: 'wrap'}}>
                {chips.map((chip, index) => (
                    <Chip
                        key={index}
                        variant={variant}
                        color={chip.color}
                        size={chipSize}
                        endDecorator={
                            <ChipDelete onDelete={() => handleDeleteChip(chip)}/>
                        }
                    >
                        {chip.text}
                    </Chip>
                ))}

                {isCreating ? (
                    <ChipCreateForm
                        onSave={handleAddChip}
                        onCancel={handleCancelCreate}
                        placeholder={placeholder}
                        size={inputSize}
                    />
                ) : (
                    <Button
                        variant="outlined"
                        color={defaultColor}
                        size={buttonSize}
                        startDecorator={<AddRounded/>}
                        onClick={() => setIsCreating(true)}
                        sx={{
                            borderStyle: 'dashed',
                            '&:hover': {
                                borderStyle: 'solid'
                            }
                        }}
                    >
                        {addButtonText}
                    </Button>
                )}
            </Stack>
        </Box>
    );
}

export default ChipManager;