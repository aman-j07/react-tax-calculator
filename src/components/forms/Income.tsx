import { TextField } from "@mui/material";
import { formInputType } from "../../types";

type propTypes={
  title:string
  inputs:formInputType[]
}

function Income() {
  return (
    <div className="deduction formcard">
      <h4 className="formcard__head">Enter Income Details(Annually)</h4>
      <form className="deduction__details column--vstart">
        <TextField required label="Basic Salary" />
        <TextField label="House Rent Allowance" />
        <TextField label="Leave Travel Allowance" />
        <TextField label="Any other allowance" />
      </form>
    </div>
  );
}

export default Income;
