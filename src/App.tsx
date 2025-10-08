import NavBar from "./shared/components/layout/NavBar.tsx";
import {Box, Sheet} from "@mui/joy";
import {Navigate, Route, Routes} from 'react-router-dom';
import {lazy, Suspense} from 'react';
import Typography from "@mui/joy/Typography";

const Dashboard = lazy(() => import('./features/dashboard/Dashboard.tsx'));
const MealPlan = lazy(() => import('./features/meal-plan/MealPlan.tsx'));
const Pantry = lazy(() => import('./features/pantry/Pantry.tsx'));
const RecipeBank = lazy(() => import('./features/recipe_page/RecipeBank.tsx'));

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
                    <Suspense fallback={<div style={{margin: 'auto', fontSize: 14, opacity: 0.7}}>Loading…</div>}>
                        <Routes>
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/meal-plan" element={<MealPlan/>}/>
                            <Route path="/recipes" element={<RecipeBank/>}/>
                            <Route path="/pantry" element={<Pantry/>}/>
                            <Route path="*" element={<Navigate to="/" replace/>}/>
                        </Routes>
                    </Suspense>
                </Sheet>
            </Sheet>

            {/*Footer*/}
            <Box>
                <Typography
                    sx={{
                        fontSize: 12,
                        textAlign: 'end',
                        px: 2,
                    }}
                >
            {/*        Animated icons by Lordicon.com*/}
                </Typography>
            </Box>
        </Sheet>
    )
}

export default App