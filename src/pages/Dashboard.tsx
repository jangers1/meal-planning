import {Sheet, Typography} from '@mui/joy';

function Dashboard() {
  return (
    <Sheet sx={{p:2, width: '100%'}}>
      <Typography level="h3">Dashboard</Typography>
      <Typography level="body-md" sx={{mt:1}}>Welcome to your meal planning dashboard.</Typography>
    </Sheet>
  );
}

export default Dashboard;
