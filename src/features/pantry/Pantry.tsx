import {Sheet, Typography} from '@mui/joy';

function Pantry() {
  return (
    <Sheet sx={{p:2, width: '100%'}}>
      <Typography level="h3">Pantry</Typography>
      <Typography level="body-md" sx={{mt:1}}>Track your pantry items here.</Typography>
    </Sheet>
  );
}

export default Pantry;
