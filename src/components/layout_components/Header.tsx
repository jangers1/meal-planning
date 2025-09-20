import '../../stylesheets/header.css'

import {IconButton, Sheet} from "@mui/joy";
import MenuIcon from '@mui/icons-material/Menu';

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
                <div className={'header-title'}>
                    <h1>
                        Welcome {user_name}
                    </h1>
                </div>
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