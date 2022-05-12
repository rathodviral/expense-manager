import { categoryApi } from "../../api";
import {
  categoryStatusInProgress,
  categoryStatusSuccessfully
} from "./category.actions";

export const loadCategories = () => async (dispatch) => {
  dispatch(categoryStatusInProgress());
  const response = await categoryApi.get();
  console.log(response);
  dispatch(categoryStatusSuccessfully(response.data));
};
