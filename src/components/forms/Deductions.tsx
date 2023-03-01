import { FormControlLabel, Switch, TextField } from "@mui/material";

function Deductions() {
  return (
    <div className="income formcard">
      <h4 className="formcard__head">Enter Deduction Details(Annually)</h4>
      <form className="income__details column--vstart">
        <TextField label="80 C" />
        <TextField label="80 D" />
        <TextField label="80 TTA" />
        <TextField label="Standard deduction" disabled defaultValue={50000} />
        <TextField label="Rent paid" />
        <FormControlLabel
          control={<Switch />}
          label="You live in a metro city?"
        />
      </form>
    </div>
  );
}

export default Deductions;
