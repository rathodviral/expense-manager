import { sortByDate, sortByName } from "../../utilities";
import {
  getExpenseTypeCategories,
  getIncomeTypeCategories
} from "../categories/category.selectors";

const totalCalcuation = (userData, isExpense, isPaid) => {
  const list = userData.filter((x) => x.isExpense === isExpense);
  const filterdList =
    isPaid !== undefined
      ? list.filter((x) => x.isPaid === isPaid).map((x) => x.amount)
      : list.map((x) => x.amount);
  return filterdList.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
};

export const getExpenses = (state) => state.expenses;

export const getExpenseTypeData = (state) => {
  const { data } = getExpenses(state);
  return data
    .filter((x) => x.isExpense)
    .map((x) => {
      const list = getExpenseTypeCategories(state).sort(sortByName);
      const { name } = list.find((y) => y.id === x.category);
      return {
        ...x,
        categoryName: name
      };
    })
    .sort(sortByDate)
    .reverse();
};

export const getIncomeTypeData = (state) => {
  const { data } = getExpenses(state);
  return data
    .filter((x) => !x.isExpense)
    .map((x) => {
      const list = getIncomeTypeCategories(state).sort(sortByName);
      const { name } = list.find((y) => y.id === x.category);
      return {
        ...x,
        categoryName: name
      };
    })
    .sort(sortByDate)
    .reverse();
};

export const getExpenseTypeDataTotal = (state) => {
  const { data } = getExpenses(state);
  return totalCalcuation(data, true);
};

export const getIncomeTypeDataTotal = (state) => {
  const { data } = getExpenses(state);
  return totalCalcuation(data, false);
};

export const getExpenseTypeDataPaidTotal = (state) => {
  const { data } = getExpenses(state);
  return totalCalcuation(data, true, true);
};

export const getIncomeTypeDataUnPaidTotal = (state) => {
  const { data } = getExpenses(state);
  return totalCalcuation(data, true, false);
};

export const isExpensesLoad = (state) => {
  console.log(state);
  const { loading } = getExpenses(state);
  return loading;
};
