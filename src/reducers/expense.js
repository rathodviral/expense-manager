import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { expenseApi } from "../api";

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
  state.expense.category.filter((x) => x.isExpense);

export const categoryIncomeList = (state) =>
  state.expense.category.filter((x) => !x.isExpense);

export const userExpenseList = (state) =>
  state.expense.data.filter((x) => x.isExpense);

export const userIncomeList = (state) =>
  state.expense.data.filter((x) => !x.isExpense);

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
