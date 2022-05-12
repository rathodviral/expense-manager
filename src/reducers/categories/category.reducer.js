import {
  CATEGORY_FAIL,
  CATEGORY_PROGRESS,
  CATEGORY_SUCCESS
} from "./category.types";

const initialState = {
  loading: false,
  data: [],
  errors: ""
};

export default function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case CATEGORY_PROGRESS:
      return { ...state, ...{ loading: true } };
    case CATEGORY_SUCCESS:
      return { ...state, ...{ loading: false, data: action.payload } };
    case CATEGORY_FAIL:
      return { ...state, ...{ loading: false, errors: action.payload } };
    default:
      return state;
  }
}
