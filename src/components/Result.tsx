import { Typography } from "@mui/material"
import { resultType } from "../types"

type propType={
    result:resultType
}

function Result(props:propType) {
    const {result}={...props}
  return (
    <div className="result">
        <Typography gutterBottom variant="h6">Results</Typography>
        <Typography>Total Income:₹{result.totalIncome}</Typography>
        <Typography>Total Deductions:₹{result.totalDeductions}</Typography>
        <Typography>Taxable Income:₹{result.taxableIncome}</Typography>
        <Typography>Tax(Old Regime):₹{result.taxOldRegime}</Typography>
        <Typography>Tax(New Regime):₹{result.taxNewRegime}</Typography>
    </div>
  )
}

export default Result