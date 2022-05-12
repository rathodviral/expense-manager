import { expenseApi } from "../../api";
import { categoryStatusSuccessfully } from "../categories";
import {
  expenseStatusInProgress,
  expenseStatusSuccessfully
} from "./expense.actions";

export const loadExpenses = () => async (dispatch) => {
  dispatch(expenseStatusInProgress());
  const response = await expenseApi.get();
  dispatch(categoryStatusSuccessfully(response.category));
  dispatch(expenseStatusSuccessfully(response.data));
};
