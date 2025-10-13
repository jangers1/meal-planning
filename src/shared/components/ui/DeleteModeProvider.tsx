import type {ReactNode} from 'react';
import React, {useState} from 'react';
import {Box, Button, DialogActions, DialogContent, DialogTitle, IconButton, Modal, ModalDialog} from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import {DeleteModeContext, useDeleteMode} from '../../hooks/useDeleteMode';

interface DeleteModeProviderProps {
    children: ReactNode;
}

export function DeleteModeProvider({children}: DeleteModeProviderProps) {
    const [isDeleteMode, setDeleteMode] = useState(false);

    return (
        <DeleteModeContext.Provider value={{isDeleteMode, setDeleteMode}}>
            {children}
        </DeleteModeContext.Provider>
    );
}

interface DeletableItemProps {
    children: ReactNode;
    onDelete: () => void;
    itemId: string | number;
    confirmMessage?: string;
    requireConfirmation?: boolean;
}

export function DeletableItem({
                                  children,
                                  onDelete,
                                  confirmMessage = "Are you sure you want to delete this item?",
                                  requireConfirmation = true
                              }: DeletableItemProps) {
    const {isDeleteMode} = useDeleteMode();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (requireConfirmation) {
            setShowConfirmation(true);
        } else {
            onDelete();
        }
    };

    const handleConfirmDelete = () => {
        onDelete();
        setShowConfirmation(false);
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    animation: isDeleteMode ? 'wobble 0.15s ease-in-out infinite alternate' : 'none',
                    '@keyframes wobble': {
                        '0%': {
                            transform: 'rotate(-0.5deg)',
                        },
                        '100%': {
                            transform: 'rotate(0.5deg)',
                        },
                    },
                }}
            >
                {children}
                {isDeleteMode && (
                    <IconButton
                        onClick={handleDeleteClick}
                        size="sm"
                        color="danger"
                        variant="solid"
                        sx={{
                            position: 'absolute',
                            top: -8,
                            left: -8,
                            width: 20,
                            height: 20,
                            minWidth: 20,
                            minHeight: 20,
                            borderRadius: '50%',
                            zIndex: 1000,
                            backgroundColor: '#ff3b30',
                            '&:hover': {
                                backgroundColor: '#d70015',
                            },
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                    >
                        <CloseIcon sx={{fontSize: 12}}/>
                    </IconButton>
                )}
            </Box>

            {requireConfirmation && (
                <Modal open={showConfirmation} onClose={handleCancelDelete}>
                    <ModalDialog variant="outlined" role="alertdialog">
                        <DialogTitle>
                            <WarningRoundedIcon/>
                            Confirmation
                        </DialogTitle>
                        <DialogContent>
                            {confirmMessage}
                        </DialogContent>
                        <DialogActions>
                            <Button variant="solid" color="danger" onClick={handleConfirmDelete}>
                                Delete
                            </Button>
                            <Button variant="plain" color="neutral" onClick={handleCancelDelete}>
                                Cancel
                            </Button>
                        </DialogActions>
                    </ModalDialog>
                </Modal>
            )}
        </>
    );
}
