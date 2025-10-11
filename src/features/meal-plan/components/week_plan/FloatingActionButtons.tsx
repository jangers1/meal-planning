import {Box} from '@mui/joy';
import ActionButton from '../../../../shared/components/ui/ActionButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SaveIcon from '@mui/icons-material/Save';

interface FloatingActionButtonsProps {
    onExportShoppingList: () => void;
    onSave: () => void;
}

export default function FloatingActionButtons({
    onExportShoppingList,
    onSave,
}: FloatingActionButtonsProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                position: 'fixed',
                bottom: 20,
                right: 20,
                gap: 2,
            }}
        >
            <ActionButton
                color="warning"
                variant="solid"
                icon={<OpenInNewIcon sx={{fontSize: '20px'}} />}
                onClick={onExportShoppingList}
                style={{
                    height: '50px',
                    padding: '0 15px',
                    boxShadow: '0px 10px 18px rgba(0, 0, 0, 0.5)',
                }}
                tooltip="Export Selected Meals to Shopping List"
            />

            <ActionButton
                color="success"
                variant="solid"
                icon={<SaveIcon sx={{fontSize: '20px'}} />}
                onClick={onSave}
                style={{
                    height: '50px',
                    padding: '0 15px',
                    boxShadow: '0px 10px 18px rgba(0, 0, 0, 0.5)',
                }}
                tooltip="Save Meal Plan"
            />
        </Box>
    );
}

