import {Button, Box} from "@mui/joy";
import React, {type CSSProperties} from "react";
import type {JoyColours, JoySizes, JoyVariants} from "../../types/ui.types.ts";

interface ActionButtonProps {
    color: JoyColours;
    icon: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    size?: JoySizes;
    variant?: JoyVariants;
    style?: CSSProperties;
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
        <Button
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
            <Box>
                {icon}
            </Box>
        </Button>
    )
}

export default ActionButton;