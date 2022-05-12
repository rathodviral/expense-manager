import { configureStore } from "@reduxjs/toolkit";
import {
  categoriesReducer,
  categoryReducer,
  expenseReducer,
  expensesReducer
} from "./reducers";

export default configureStore({
  reducer: {
    category: categoryReducer,
    expense: expenseReducer,
    categories: categoriesReducer,
    expenses: expensesReducer
  }
});
