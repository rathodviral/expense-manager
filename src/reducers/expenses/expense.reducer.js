import {
  EXPENSE_FAIL,
  EXPENSE_PROGRESS,
  EXPENSE_SUCCESS
} from "./expense.types";

const initialState = {
  loading: false,
  data: [],
  errors: ""
};

export default function expensesReducer(state = initialState, action) {
  switch (action.type) {
    case EXPENSE_PROGRESS:
      return { ...state, ...{ loading: true } };
    case EXPENSE_SUCCESS:
      return { ...state, ...{ loading: false, data: action.payload } };
    case EXPENSE_FAIL:
      return { ...state, ...{ loading: false, errors: action.payload } };
    default:
      return state;
  }
}
