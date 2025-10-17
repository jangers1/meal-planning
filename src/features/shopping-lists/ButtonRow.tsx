import {Box, Button, Input} from "@mui/joy";

function ButtonRow() {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    mt: 2,
                }}
            >
                <Input
                    sx={{
                        flexGrow: 1,
                    }}
                    placeholder={'Search Lists'}
                />
                <Button

                >
                    Create List
                </Button>
                <Button
                    color={'danger'}
                >
                    Delete List
                </Button>
            </Box>
        </>
    )
}

export default ButtonRow;