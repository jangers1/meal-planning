import {Box, Button, IconButton, Input} from "@mui/joy";
import CloseRounded from '@mui/icons-material/CloseRounded';
import {useDeleteMode} from "../../shared/hooks/useDeleteMode.ts";

interface ButtonRowProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

function ButtonRow({searchTerm, setSearchTerm}: ButtonRowProps) {
    const {isDeleteMode, setDeleteMode} = useDeleteMode();

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
                    color={isDeleteMode ? "success" : "danger"}
                    onClick={() => setDeleteMode(!isDeleteMode)}
                >
                    {isDeleteMode ? "Save Changes" : "Delete Lists"}
                </Button>
            </Box>
        </>
    )
}

export default ButtonRow;