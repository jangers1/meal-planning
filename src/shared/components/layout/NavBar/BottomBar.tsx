import {Avatar, Box, Button, styled} from "@mui/joy";
import type {LordIconProps} from '../../ui/LordIcon';
import {LordIcon} from '../../ui/LordIcon';
import {useRef} from 'react';

interface BottomBarProps {
    collapseHandler?: () => void;
    isCollapsed?: boolean;
    settingsHandler?: () => void;
    transitionWidth?: string;
}

const SettingButton = styled(Button)({
    boxShadow: "inset 3px 3px 7px rgba(136, 165, 191, 0.48), inset -3px -3px 7px #FFFFFF",
    transition: "all {transitionWidth}",
    width: '50px',
    height: '50px',
    '& div': {
        minWidth: '50px',
        transition: 'transform {transitionWidth}',
    },
    '&:hover': {
        backgroundColor: 'transparent !important',
        '& div': {
            transform: 'scale(1.2)',
        }
    },
    '&:active': {
        backgroundColor: 'transparent !important',
        boxShadow: 'none',
        '& div': {
            transform: 'scale(1.1)',
        }
    }
});

// Keyframes for Avatar - straight up movement
const avatarUpAnimation = `
@keyframes avatarUp {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(-150px);
    }
}

@keyframes avatarDown {
    0% {
        transform: translateY(-150px);
    }
    100% {
        transform: translateY(0);
    }
}
`;

// Keyframes for Settings - left then up movement
const settingsPathAnimation = `
@keyframes settingsPath {
    0% {
        transform: translate(0, 0);
    }
    50% {
        transform: translate(-50px, 0);
    }
    100% {
        transform: translate(-50px, -75px);
    }
}

@keyframes settingsPathReverse {
    0% {
        transform: translate(-50px, -75px);
    }
    50% {
        transform: translate(-50px, 0);
    }
    100% {
        transform: translate(0, 0);
    }
}
`;

// Keyframes for Collapse - left movement only
const collapseLeftAnimation = `
@keyframes collapseLeft {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-100px);
    }
}

@keyframes collapseRight {
    0% {
        transform: translateX(-100px);
    }
    100% {
        transform: translateX(0);
    }
}
`;

function BottomBar({collapseHandler, isCollapsed, settingsHandler, transitionWidth}: BottomBarProps) {
    const settingsIconRef = useRef<LordIconProps>(null);
    const arrowsIconRef = useRef<LordIconProps>(null);

    const handleSettingsClick = () => {
        settingsIconRef.current?.play();
        settingsHandler?.();
    };

    const handleArrowsClick = () => {
        arrowsIconRef.current?.play();
        collapseHandler?.();
    };

    return (
        <>
            <style>
                {avatarUpAnimation}
                {settingsPathAnimation}
                {collapseLeftAnimation}
            </style>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '70px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    pb: 2,
                    px: 2,
                }}
            >
                {/* Avatar Button - positioned at left in flex */}
                <Button
                    variant="plain"
                    sx={{
                        boxShadow: "inset 3px 3px 7px rgba(136, 165, 191, 0.48), inset -3px -3px 7px #FFFFFF",
                        width: '50px',
                        height: '50px',
                        minWidth: '50px',
                        minHeight: '50px',
                        padding: 0,
                        position: 'relative',
                        animation: isCollapsed
                            ? `avatarUp ${transitionWidth} forwards`
                            : `avatarDown ${transitionWidth} forwards`,
                        '&:hover': {
                            backgroundColor: 'transparent !important',
                        },
                        '&:active': {
                            backgroundColor: 'transparent !important',
                        }
                    }}
                >
                    <Avatar
                        size={'md'}
                    />
                </Button>

                {/* Settings Button - positioned at middle in flex */}
                <SettingButton
                    variant="plain"
                    onClick={handleSettingsClick}
                    sx={{
                        position: 'relative',
                        animation: isCollapsed
                            ? `settingsPath ${transitionWidth} forwards`
                            : `settingsPathReverse ${transitionWidth} forwards`,
                    }}
                >
                    <LordIcon icon="settings" size={25} ref={settingsIconRef}/>
                </SettingButton>

                {/* Arrows/Collapse Button - positioned at right in flex */}
                <SettingButton
                    variant="plain"
                    onClick={handleArrowsClick}
                    aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
                    sx={{
                        position: 'relative',
                        animation: isCollapsed
                            ? `collapseLeft ${transitionWidth} forwards`
                            : `collapseRight ${transitionWidth} forwards`,
                    }}
                >
                    <LordIcon icon="arrows" size={25} ref={arrowsIconRef}/>
                </SettingButton>
            </Box>
        </>
    )
}

export default BottomBar;
