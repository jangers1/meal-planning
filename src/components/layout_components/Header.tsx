import '../../stylesheets/header.css'

import {IconButton, Sheet} from "@mui/joy";
import MenuIcon from '@mui/icons-material/Menu';
import Typography from "@mui/joy/Typography";

interface HeaderProps {
    user_name: string
}

function Header({ user_name }: HeaderProps) {
    return (
        <>
            <Sheet
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: 'min-content',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 1,
                    backgroundColor: 'var(--primary-color)',
                }}
            >
                <Typography sx={{
                    textAlign: 'center',
                    flex: 1,
                    fontSize: '1.5rem'
                }}>
                    Welcome {user_name}!
                </Typography>
                <IconButton
                    size={'lg'}
                    variant={'outlined'}
                >
                    <MenuIcon />
                </IconButton>
            </Sheet>
        </>
    )
}

export default Header;