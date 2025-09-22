import {Avatar, Box, Chip} from "@mui/joy";

interface NameDisplayProps {
    name: string;
}

function ChipContent({name}: { name: string }) {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    alignItems: 'center',
                    p: 0.5
                }}
            >
                <Avatar
                    sx={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%'
                    }}
                />
                {name}
            </Box>
        </>
    )
}

function NameDisplay({name}: NameDisplayProps) {
    return (
        <>
            <Chip
                variant="outlined"
                color="primary"
                sx={{
                    '--Chip-radius': '5px'
                }}
            >
                <ChipContent name={name}/>
            </Chip>
        </>
    )
}

export default NameDisplay;