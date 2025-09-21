import {useState} from 'react';
import {Box, Button, Chip, ChipDelete, Stack} from '@mui/joy';
import {AddRounded} from '@mui/icons-material';
import ChipCreateForm, {type ChipData} from './ChipCreateForm.tsx';

interface ChipManagerProps {
    chips: ChipData[];
    onChipsChange: (chips: ChipData[]) => void;
    availableTags?: ChipData[];
    onNewTagCreated?: (newTag: ChipData) => void;
}

function ChipManager({
                         chips,
                         onChipsChange,
                         availableTags,
                         onNewTagCreated
                     }: ChipManagerProps) {
    const [isCreating, setIsCreating] = useState(false);

    const isChipDuplicate = (newChip: ChipData): boolean => {
        return chips.some(chip => chip.text === newChip.text);
    };

    const handleAddChip = (newChip: ChipData) => {
        if (!newChip.text || isChipDuplicate(newChip)) {
            setIsCreating(false);
            return;
        }

        onChipsChange([...chips, newChip]);
        onNewTagCreated?.(newChip);
        setIsCreating(false);
    };

    const handleDeleteChip = (chipToDelete: ChipData) => {
        onChipsChange(chips.filter(chip => chip.text !== chipToDelete.text));
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
    };

    const handleStartCreate = () => {
        setIsCreating(true);
    };

    const renderChip = (chip: ChipData) => (
        <Chip
            key={`${chip.text}-${chip.color}`}
            variant={'soft'}
            color={chip.color}
            size={'lg'}
            endDecorator={
                <ChipDelete onDelete={() => handleDeleteChip(chip)}/>
            }
        >
            {chip.text}
        </Chip>
    );

    const renderCreateForm = () => (
        <ChipCreateForm
            onSave={handleAddChip}
            onCancel={handleCancelCreate}
            availableTags={availableTags}
        />
    );

    const renderAddButton = () => (
        <Button
            variant="outlined"
            color={'primary'}
            size={'md'}
            startDecorator={<AddRounded/>}
            onClick={handleStartCreate}
            sx={{
                borderStyle: 'dashed',
                '&:hover': {
                    borderStyle: 'solid'
                }
            }}
        >
            {'Add Tag'}
        </Button>
    );

    return (
        <Box>
            <Stack direction="row" spacing={2} sx={{flexWrap: 'wrap'}}>
                {chips.map(renderChip)}
                {isCreating ? renderCreateForm() : renderAddButton()}
            </Stack>
        </Box>
    );
}

export default ChipManager;