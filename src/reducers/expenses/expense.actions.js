import {
  EXPENSE_FAIL,
  EXPENSE_PROGRESS,
  EXPENSE_SUCCESS
} from "./expense.types";

export const expenseStatusInProgress = () => ({ type: EXPENSE_PROGRESS });

export const expenseStatusFailed = (error) => ({
  type: EXPENSE_FAIL,
  payload: error
});

export const expenseStatusSuccessfully = (data) => ({
  type: EXPENSE_SUCCESS,
  payload: data
});
