export type formInputType = {
  id: number;
  name: string;
  required: boolean;
  max: null | number;
  disabled: boolean;
  value: string;
  type: string;
  error: boolean;
};

export type resultType={
  totalIncome: number;
  totalDeductions: number;
  taxableIncome:number,
  taxOldRegime:number,
  taxNewRegime:number,
}

export type typeState = {
  formData: {
    incomes: formInputType[];
    deductions: formInputType[];
  };
  results: resultType
};
