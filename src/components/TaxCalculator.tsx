import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useState } from "react";
import { typeState } from "../types";
import Form from "./forms/Form";
import Result from "./Result";

function TaxCalculator() {

  // fn to handle any change in inputboxes 
  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    category: "incomes" | "deductions",
    index: number
  ) => {
    let inputElement = state.formData[category][index];
    let value = e.currentTarget.value;

    // validation for numeric data to match with only digits
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

  const [state, setState] = useState<typeState>({
    // key for storing and handling formdata enterred by user 
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
      // key for storing the details of result
    },
    results: {
      totalIncome: 0,
      totalDeductions: 0,
      taxableIncome:0,
      taxOldRegime: 0,
      taxNewRegime: 0,
    },
  });

  // separate state for handling steps for stepper component (MUI)
  const [activeStep, setActiveStep] = useState(0);

  // fn to validate all the inputs according to the form displayed(i.e. based on activeStep)
  const validate = (index: number) => {
    let formDataArr = Object.values(state.formData)[index];
    let found = false;
    // using foreach to traverse formdata array to find any wrong values enterred
    formDataArr.forEach((ele) => {
      if (ele.type !== "checkbox") {
        if (ele.required && ele.value === "") {
          ele.error = true;
          found = true;
        } else if (ele.max !== null && parseFloat(ele.value) > ele.max) {
          ele.error = true;
          found = true;
        } else {
          ele.error = false;
        }
      }
    });

    // if any error is found state is updated
    if (found) {
      let formKey = Object.keys(state.formData)[index];
      Object.assign(state.formData, { [formKey]: formDataArr });
      setState({ ...state });
    }
    // // if any error is not found increase activestep value
     else {
      setActiveStep((prev) => prev + 1);
      // condition for checking for last step for triggering tax calculating function
      if (activeStep === steps.length - 2) {
        taxCalculate();
      }
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

  // fn to calculate the three options for HRA deduction and return lowest
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
    return lowest < 0 ? 0 : Math.round(lowest);
  };

  // function to calculate income tax according to both regimes
  const calculateIncomeTax = (income: number) => {
    // array storing slabs of old regime
    let oldRegimeSlabs = [
      {
        upperLimit: Number.POSITIVE_INFINITY,
        lowerLimit: 1000000,
        taxPercentage: 30,
        additionalConstant: 112500,
      },
      {
        upperLimit: 1000000,
        lowerLimit: 500000,
        taxPercentage: 20,
        additionalConstant: 12500,
      },
      {
        upperLimit: 500000,
        lowerLimit: 250000,
        taxPercentage: 5,
        additionalConstant: 0,
      },
      {
        upperLimit: 250000,
        lowerLimit: 0,
        taxPercentage: 0,
        additionalConstant: 0,
      },
    ];
// array storing slabs of new regime
    let newRegimeSlabs = [
      {
        upperLimit: Number.POSITIVE_INFINITY,
        lowerLimit: 1500000,
        taxPercentage: 30,
        additionalConstant: 187500,
      },
      {
        upperLimit: 1500000,
        lowerLimit: 1250000,
        taxPercentage: 25,
        additionalConstant: 125000,
      },
      {
        upperLimit: 1250000,
        lowerLimit: 1000000,
        taxPercentage: 20,
        additionalConstant: 75000,
      },
      {
        upperLimit: 1000000,
        lowerLimit: 750000,
        taxPercentage: 15,
        additionalConstant: 37500,
      },
      {
        upperLimit: 750000,
        lowerLimit: 500000,
        taxPercentage: 10,
        additionalConstant: 12500,
      },
      {
        upperLimit: 500000,
        lowerLimit: 250000,
        taxPercentage: 5,
        additionalConstant: 0,
      },
      {
        upperLimit: 250000,
        lowerLimit: 0,
        taxPercentage: 0,
        additionalConstant: 0,
      },
    ];

    // using find method for traversing slab arrays and find the right slab for income
    const oldSlab = oldRegimeSlabs.find((ele) => {
      return income > ele.lowerLimit && income <= ele.upperLimit;
    });
    const newSlab = newRegimeSlabs.find((ele) => {
      return income > ele.lowerLimit && income <= ele.upperLimit;
    });

    // using object to store both regime taxes (rounded off)
    let incomeTax = {
      oldRegime: Math.round(
        (income - oldSlab!.lowerLimit) * (oldSlab!.taxPercentage / 100) +
          oldSlab!.additionalConstant
      ),
      newRegime: Math.round(
        (income - newSlab!.lowerLimit) * (newSlab!.taxPercentage / 100) +
          newSlab!.additionalConstant
      ),
    };

    return incomeTax;
  };

  const taxCalculate = () => {
    // calculating total of incomes enterred by user using reduce method
    let totalIncome = state.formData.incomes.reduce((a, b) => {
      if (b.type === "numeric") {
        let value = b.value === "" ? 0 : parseFloat(b.value);
        return a + value;
      } else {
        return a + 0;
      }
    }, 0);

    // calculating total of incomes enterred by user using reduce method
    let totalDeductions = state.formData.deductions.reduce((a, b) => {
      if (b.type === "numeric" && b.name !== "Rent Paid") {
        let value = b.value === "" ? 0 : parseFloat(b.value);
        return a + value;
      } else {
        return a + 0;
      }
    }, 0);

    let hraDeduction = calculateHRA();
    // adding the required deduction for HRA 
    totalDeductions = totalDeductions + hraDeduction;

    let taxableIncome = totalIncome - totalDeductions;

    let tax = calculateIncomeTax(taxableIncome);

    state.results = {
      totalIncome,
      totalDeductions,
      taxableIncome,
      taxOldRegime: tax.oldRegime,
      taxNewRegime: tax.newRegime,
    };

    setState({ ...state });
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
    },
    {
      label: "Results",
      component: <Result result={state.results} />,
    },
  ];


  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    let formData=state.formData;
    Object.values(formData).forEach(ele=>{
      ele.forEach(innerEle=>innerEle.value='')
    })
    setState({...state,formData})
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

        <Button
          onClick={() => {
            validate(activeStep);
          }}
        >
          Next
        </Button>
        {activeStep===steps.length-1? <Button onClick={handleReset}>Reset</Button>:''}
      </Box>
    </div>
  );
}

export default TaxCalculator;
