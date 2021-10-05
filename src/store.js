import { configureStore } from "@reduxjs/toolkit";
import { categoryReducer, expenseReducer } from "./reducers";

export default configureStore({
  reducer: {
    category: categoryReducer,
    expense: expenseReducer,
  },
});
