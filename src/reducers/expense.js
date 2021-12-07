import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { expenseApi } from "../api";
import { sortByName } from "../utilities";
import { sortByDate } from "../utilities/common";

const initialState = {
  category: [],
  data: [],
  status: "loading",
  error: null,
};

export const fetchExpense = createAsyncThunk(
  "expense/fetchExpense",
  async () => {
    const { data, category } = await expenseApi.get();
    return { data, category };
  }
);

export const slice = createSlice({
  name: "expense",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchExpense.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchExpense.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.data;
        state.category = action.payload.category;
      })
      .addCase(fetchExpense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

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

export const categoryExpenseList = (state) =>
  state.expense.category.filter((x) => x.isExpense).sort(sortByName);

export const categoryIncomeList = (state) =>
  state.expense.category.filter((x) => !x.isExpense).sort(sortByName);

export const userExpenseList = (state) =>
  state.expense.data
    .filter((x) => x.isExpense)
    .map((x) => {
      const list = categoryExpenseList(state);
      const { name } = list.find((y) => y.id === x.category);
      return {
        ...x,
        categoryName: name,
      };
    })
    .sort(sortByDate)
    .reverse();

export const userIncomeList = (state) =>
  state.expense.data
    .filter((x) => !x.isExpense)
    .map((x) => {
      const list = categoryIncomeList(state);
      const { name } = list.find((y) => y.id === x.category);
      return {
        ...x,
        categoryName: name,
      };
    })
    .sort(sortByDate)
    .reverse();

export const userExpenseTotal = (state) =>
  totalCalcuation(state.expense.data, true);

export const userIncomeTotal = (state) =>
  totalCalcuation(state.expense.data, false);

export const userExpensePaidTotal = (state) =>
  totalCalcuation(state.expense.data, true, true);

export const userExpenseUnPaidTotal = (state) =>
  totalCalcuation(state.expense.data, true, false);

export const showUserLoader = (state) => state.expense.status === "loading";

export default slice.reducer;
