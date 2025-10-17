import {Box, Button, IconButton, Input} from "@mui/joy";
import CloseRounded from '@mui/icons-material/CloseRounded';

interface ButtonRowProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

function ButtonRow({searchTerm, setSearchTerm}: ButtonRowProps) {
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
                    sx={{flexGrow: 1}}
                    placeholder={'Search Lists'}
                    color="primary"
                    onChange={e => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    endDecorator={
                        searchTerm && (
                            <IconButton
                                variant={'plain'}
                                color={'primary'}
                                onClick={() => setSearchTerm('')}
                                aria-label="Clear search"
                            >
                                <CloseRounded/>
                            </IconButton>
                        )
                    }
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