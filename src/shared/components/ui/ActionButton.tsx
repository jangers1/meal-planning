import {Box, Button, Tooltip} from "@mui/joy";
import React, {type CSSProperties} from "react";
import type {JoyColours, JoySizes, JoyTooltipPositions, JoyVariants} from "../../types/ui.types.ts";

interface ActionButtonProps {
    color: JoyColours;
    icon: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    size?: JoySizes;
    variant?: JoyVariants;
    style?: CSSProperties;
    tooltip?: string;
    tooltipPosition?: JoyTooltipPositions;
}

function ActionButton({
                          color,
                          icon,
                          onClick,
                          disabled = false,
                          size = 'lg',
                          variant = 'outlined',
                          style,
                          tooltip,
                          tooltipPosition = 'top-end'
                      }: ActionButtonProps) {
    return tooltip ? (
        <Tooltip
            title={tooltip}
            placement={tooltipPosition}
            variant={'soft'}
        >
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
        </Tooltip>
    ) : (
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
    );
}

export default ActionButton;