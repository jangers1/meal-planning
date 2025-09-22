import {Avatar, Box, Chip} from "@mui/joy";

function NameDisplay({name}: { name: string }) {
    return (
        <>
            <Chip
                variant="outlined"
                color="primary"
                sx={{
                    '--Chip-radius': '5px'
                }}
            >
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
            </Chip>
        </>
    )
}

export default NameDisplay;