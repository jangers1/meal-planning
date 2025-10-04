import {Autocomplete, Button, Input, Stack} from "@mui/joy";

function SearchComponents() {
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