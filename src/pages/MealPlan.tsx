import {Sheet, Typography} from '@mui/joy';

function MealPlan() {
  return (
    <Sheet sx={{p:2, width: '100%'}}>
      <Typography level="h3">Meal Plan</Typography>
      <Typography level="body-md" sx={{mt:1}}>Plan your meals for the week here.</Typography>
    </Sheet>
  );
}

export default MealPlan;
