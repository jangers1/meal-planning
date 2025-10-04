import {Autocomplete, Button, Input, Stack} from "@mui/joy";

interface SearchComponentsProps {
    onCreateGeneric: () => void;
}

function SearchComponents({ onCreateGeneric }: SearchComponentsProps) {
    return (
        <>
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    width: '65%'
                }}
            >
                <Button
                    variant={'outlined'}
                    color={'primary'}
                    onClick={onCreateGeneric}
                >
                    Create Generic
                </Button>
                <Input
                    placeholder="Search Recipes"
                    color={'primary'}
                    sx={{
                        flexGrow: 1
                    }}
                />
                <Autocomplete
                    color={'primary'}
                    placeholder="Search Tags"
                    sx={{
                        flexGrow: 1
                    }}
                    options={[]}
                >

                </Autocomplete>
            </Stack>
        </>
    )
}

export default SearchComponents;