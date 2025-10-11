import {Modal, ModalClose} from "@mui/joy";
import RecipeCreate from "../RecipeCreate";
import {useState} from "react";

interface RecipeCreateModalProps {
    open: boolean;
    onClose: () => void;
}

export function RecipeCreateModal({open, onClose}: RecipeCreateModalProps) {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 400);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="create-recipe-modal"
            aria-describedby="modal-to-create-a-new-recipe"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            slotProps={{
                backdrop: {
                    sx: {
                        backdropFilter: 'blur(4px)',
                        transition: 'backdrop-filter 400ms, opacity 400ms',
                        opacity: !isClosing ? 1 : 0,
                    }
                }
            }}
        >
            <>
                <ModalClose
                    sx={{
                        transition: 'all 200ms',
                        '&:hover': {
                            transform: 'rotate(90deg)',
                        }
                    }}
                />
                <RecipeCreate
                    isClosing={isClosing}
                    onSave={handleClose}
                    onCancel={handleClose}
                />
            </>
        </Modal>
    );
}

