import NavBar from './components/layout_components/NavBar';
import {Sheet} from "@mui/joy";
import RecipeBank from "./pages/RecipeBank.tsx";
import {Routes, Route, Navigate} from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import MealPlan from './pages/MealPlan.tsx';
import Pantry from './pages/Pantry.tsx';

function App() {
    return (
        <Sheet sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/*<Sheet sx={{flexShrink: 0}}>*/}
            {/*    <Header user_name="Roshan"/>*/}
            {/*</Sheet>*/}
            <Sheet sx={{
                flex: 1,
                display: 'flex',
                overflow: 'hidden'
            }}>
                <NavBar
                    onItemSelect={(itemId) => console.log(`Selected item: ${itemId}`)}
                />
                <Sheet sx={{
                    display: 'flex',
                    flex: 1,
                    overflow: 'auto',
                    mx: 4,
                    my: 2
                }}>
                    <Routes>
                        <Route path="/" element={<Dashboard/>} />
                        <Route path="/meal-plan" element={<MealPlan/>} />
                        <Route path="/recipes" element={<RecipeBank/>} />
                        <Route path="/pantry" element={<Pantry/>} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Sheet>
            </Sheet>
        </Sheet>
    )
}

export default App