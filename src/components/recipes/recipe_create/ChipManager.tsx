import {useState} from 'react';
import {Box, Button, Chip, ChipDelete} from '@mui/joy';
import {AddRounded} from '@mui/icons-material';
import ChipCreateForm, {type ChipData} from './ChipCreateForm.tsx';
import {useAlerts} from '../../ui_components/alerts/AlertProvider.tsx';

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
    const alerts = useAlerts();
    const [isCreating, setIsCreating] = useState(false);

    const isChipDuplicate = (newChip: ChipData): boolean => {
        return chips.some(chip => chip.text === newChip.text);
    };

    const handleAddChip = (newChip: ChipData) => {
        if (!newChip.text) {
            setIsCreating(false);
            return;
        }

        if (isChipDuplicate(newChip)) {
            alerts.pushWarning('Chip already exists');
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
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                alignItems: 'center'
            }}
        >
            {chips.map(renderChip)}
            {isCreating ? renderCreateForm() : renderAddButton()}
        </Box>
    );
}

export default ChipManager;