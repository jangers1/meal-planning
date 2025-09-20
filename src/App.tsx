import Header from './components/layout_components/Header';
import NavBar from './components/layout_components/NavBar';
import { Box } from "@mui/joy";
import Recipe from "./components/ui_components/Recipe.tsx";

function App() {
    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <Box sx={{ flexShrink: 0 }}>
                <Header user_name="Roshan" />
            </Box>
            <Box sx={{
                flex: 1,
                display: 'flex',
                overflow: 'hidden'
            }}>
                <NavBar
                    onItemSelect={(itemId) => console.log(`Selected item: ${itemId}`)}
                />
                <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    backgroundColor: 'var(--secondary-color)',
                    px: 2,
                    py: 1,
                }}>
                    <Recipe />
                </Box>
            </Box>
        </Box>
    )
}

export default App
