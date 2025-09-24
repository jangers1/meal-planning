import React from 'react';
import {Box, Chip} from '@mui/joy';
import type {SxProps} from "@mui/system";
import type {JoyColours, JoySizes, JoyVariants} from "../../types.ts";

interface ActionButtonProps {
    color: JoyColours;
    icon: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    size?: JoySizes;
    variant?: JoyVariants;
    style?: SxProps
}

function ActionButton({
                          color,
                          icon,
                          onClick,
                          disabled = false,
                          size = 'lg',
                          variant = 'outlined',
                          style
                      }: ActionButtonProps) {
    return (
        <Chip
            variant={variant}
            color={color}
            size={size}
            onClick={onClick}
            disabled={disabled}
            sx={{
                cursor: 'pointer',
                minWidth: 'auto',
                px: 0.5,
                '& .MuiBox-root': {
                    display: 'flex'
                },
                ...style
            }}
        >
            < Box sx={{fontSize: 16}}>
                {icon}
            </Box>
        </Chip>
    )
}

export default ActionButton;