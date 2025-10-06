import {Button, DialogActions, DialogContent, DialogTitle, Input, Modal, ModalDialog} from '@mui/joy';
import React, {useCallback, useState} from 'react';

interface CreateGenericRecipeDialogProps {
    open: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
    defaultName?: string;
}

export default function CreateGenericRecipeDialog({
                                                      open,
                                                      onClose,
                                                      onCreate,
                                                      defaultName = '',
                                                  }: CreateGenericRecipeDialogProps) {
    const [recipeName, setRecipeName] = useState(defaultName);

    const handleCreate = useCallback(() => {
        if (recipeName.trim()) {
            onCreate(recipeName.trim());
            setRecipeName('');
            onClose();
        }
    }, [recipeName, onCreate, onClose]);

    const handleCancel = useCallback(() => {
        setRecipeName('');
        onClose();
    }, [onClose]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                handleCreate();
            }
        },
        [handleCreate]
    );

    return (
        <Modal open={open} onClose={handleCancel}>
            <ModalDialog>
                <DialogTitle>Create Generic Recipe</DialogTitle>
                <DialogContent>
                    <Input
                        placeholder="Enter recipe name"
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        sx={{mt: 1}}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="solid"
                        color="primary"
                        onClick={handleCreate}
                        disabled={!recipeName.trim()}
                    >
                        Create
                    </Button>
                    <Button variant="plain" color="neutral" onClick={handleCancel}>
                        Cancel
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    );
}

