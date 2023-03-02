import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Form from "./forms/Form";

function TaxCalculator() {
  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    category: "incomes" | "deductions",
    index: number
  ) => {
    let inputElement = state.formData[category][index];
    let value = e.currentTarget.value;
    if (
      inputElement.type === "numeric" &&
      (value.match(/^\d+$/) || value === "")
    ) {
      inputElement.value = value;
    } else if (inputElement.type === "checkbox") {
      inputElement.value = inputElement.value === "" ? "checked" : "";
    }
    state.formData[category][index] = inputElement;
    setState({ ...state });
  };

  const [state, setState] = useState({
    formData: {
      incomes: [
        {
          id: 1,
          name: "Basic Salary",
          required: true,
          max: null,
          disabled: false,
          value: "",
          type: "numeric",
          error: false,
        },
        {
          id: 2,
          name: "House Rent Allowance",
          required: false,
          max: null,
          disabled: false,
          value: "",
          type: "numeric",
          error: false,
        },
        {
          id: 3,
          name: "Leave Travel Allowance",
          required: false,
          max: null,
          disabled: false,
          value: "",
          type: "numeric",
          error: false,
        },
        {
          id: 4,
          name: "Any other allowance",
          required: false,
          max: null,
          disabled: false,
          value: "",
          type: "numeric",
          error: false,
        },
      ],
      deductions: [
        {
          id: 1,
          name: "80 C",
          required: true,
          max: 150000,
          disabled: false,
          value: "",
          type: "numeric",
          error: false,
        },
        {
          id: 2,
          name: "80 D",
          required: true,
          max: 12000,
          disabled: false,
          value: "",
          type: "numeric",
          error: false,
        },
        {
          id: 3,
          name: "80 TTA",
          required: true,
          max: 8000,
          disabled: false,
          value: "",
          type: "numeric",
          error: false,
        },
        {
          id: 4,
          name: "Standard Deduction",
          required: true,
          max: null,
          disabled: true,
          value: "50000",
          type: "numeric",
          error: false,
        },
        {
          id: 5,
          name: "Rent Paid",
          required: true,
          max: null,
          disabled: false,
          value: "",
          type: "numeric",
          error: false,
        },
        {
          id: 6,
          name: "Do you live in a metro city?",
          required: false,
          max: null,
          disabled: false,
          value: "",
          type: "checkbox",
          error: false,
        },
      ],
    },
    results: {
      totalIncome: 0,
      totalDeductions: 0,
      tax: { oldRegime: 0, newRegime: 0 },
    },
  });

  const validate = (index: number) => {
    let formDataArr = Object.values(state.formData)[index];
    let found = false;
    formDataArr.forEach((ele) => {
      if (ele.type !== "checkbox") {
        if (ele.required && ele.value === "") {
          ele.error = true;
          found = true;
        } else if (ele.max !== null && parseInt(ele.value) > ele.max) {
          ele.error = true;
          found = true;
        } else {
          ele.error = false;
        }
      }
    });

    if (found) {
      let formKey = Object.keys(state.formData)[index];
      Object.assign(state.formData, { [formKey]: formDataArr });
      setState({ ...state });
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  // fn to get any value from form data which is numeric
  const getNumericFormData = (
    category: "incomes" | "deductions",
    name: string
  ) => {
    let inpObj = state.formData[category].find((ele) => ele.name === name);
    if (inpObj !== undefined) {
      return parseFloat(inpObj.value);
    } else {
      return -1;
    }
  };

  // fn to get any value from form data which is checkbox
  const getCheckboxFormData = (
    category: "incomes" | "deductions",
    name: string
  ) => {
    let inpObj = state.formData[category].find((ele) => ele.name === name);
    if (inpObj !== undefined) {
      return inpObj.value === "checked";
    } else {
      return -1;
    }
  };

  const calculateHRA = () => {
    let basicSalary = getNumericFormData("incomes", "Basic Salary");
    let hra = getNumericFormData("incomes", "House Rent Allowance");
    let rentPaid = getNumericFormData("deductions", "Rent Paid");
    let inMetroCity = getCheckboxFormData(
      "deductions",
      "Do you live in a metro city?"
    );

    let hraObj = {
      first: hra,
      second: rentPaid - 0.1 * basicSalary,
      third: inMetroCity ? 0.5 * basicSalary : 0.4 * basicSalary,
    };

    let lowest = Math.min(hraObj.first, hraObj.second, hraObj.third);
    return lowest < 0 ? 0 : lowest;
  };

  const calculateIncomeTax = (income: number) => {
    // calculating income tax according to old regime
    
    return income;
  };

  const taxCalculate = () => {
    let totalIncome = state.formData.incomes.reduce((a, b) => {
      if (b.type === "numeric") {
        let value = b.value === "" ? 0 : parseFloat(b.value);
        return a + value;
      } else {
        return a + 0;
      }
    }, 0);
    // state.formData.incomes.reduce((a, b) => {
    //   let value =
    //     b.value.length === 0 && b.type === "numeric" ? 0 : parseFloat(b.value);
    //   return a + value;
    // }, 0);

    let totalDeductions = state.formData.deductions.reduce((a, b) => {
      if (b.type === "numeric" && b.name !== "Rent Paid") {
        let value = b.value === "" ? 0 : parseFloat(b.value);
        return a + value;
      } else {
        return a + 0;
      }
    }, 0);

    let hraDeduction = calculateHRA();
    totalDeductions = totalDeductions + hraDeduction;

    let taxableIncome = totalIncome - totalDeductions;
    console.log(
      "totalIncome:",
      totalIncome,
      "totalDeductions:",
      totalDeductions,
      "hraDeduction:",
      hraDeduction,
      "taxableIncome:",
      taxableIncome
    );
    // let incometax=calculateIncomeTax(taxableIncome)

    // setState({ ...state });
  };

  const steps = [
    {
      label: "Income Details",
      component: (
        <Form
          title="Enter Income Details(Annually)"
          inputs={state.formData.incomes}
          changeHandler={changeHandler}
          category={"incomes"}
        />
      ),
      completed: true,
    },
    {
      label: "Deduction Details",
      component: (
        <Form
          title="Enter Deduction Details(Annually)"
          inputs={state.formData.deductions}
          changeHandler={changeHandler}
          category={"deductions"}
        />
      ),
      completed: true,
    },
  ];

  console.log(state);

  const [activeStep, setActiveStep] = useState(0);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className="container">
      <h2>Tax Calculator</h2>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => {
          return (
            <Step key={step.label}>
              <Box>
                <StepLabel>{step.label}</StepLabel>
              </Box>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <div className="result">
            <Typography>Total Income:</Typography>
          </div>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <>
          {steps[activeStep].component}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={taxCalculate}
                disabled={!steps[activeStep].completed}
              >
                Finish
              </Button>
            ) : (
              <Button
                onClick={() => {
                  validate(activeStep);
                }}
                disabled={!steps[activeStep].completed}
              >
                Next
              </Button>
            )}
          </Box>
        </>
      )}
    </div>
  );
}

export default TaxCalculator;
