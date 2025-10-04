import {Button, Stack, Switch} from "@mui/joy";
import Typography from "@mui/joy/Typography";

function EditComponents() {
    return (
        <>
            <Stack
                direction={'row'}
                spacing={2}
            >
                <Typography
                    component="label"
                    endDecorator={
                        <Switch
                            size={'lg'}
                            variant={'outlined'}
                        />
                    }
                >
                    Include Weekend?
                </Typography>
                <Button
                    variant={'outlined'}
                    color={'primary'}
                    sx={{
                        borderStyle: 'dashed',
                    }}
                >
                    Clear All
                </Button>
            </Stack>
        </>
    )
}

export default EditComponents;