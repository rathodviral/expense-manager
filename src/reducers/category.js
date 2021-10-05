import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { categoryApi } from "../api";

const initialState = {
  data: [],
  status: "loading",
  error: null,
};

export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async () => {
    const response = await categoryApi.get();
    return response.data;
  }
);

export const slice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategory.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const expenseList = (state) =>
  state.category.data.filter((x) => x.isExpense);

export const incomeList = (state) =>
  state.category.data.filter((x) => !x.isExpense);

export const showAdminLoader = (state) => state.category.status === "loading";

export default slice.reducer;
