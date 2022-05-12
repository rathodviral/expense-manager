import {
  CATEGORY_FAIL,
  CATEGORY_PROGRESS,
  CATEGORY_SUCCESS
} from "./category.types";

export const categoryStatusInProgress = () => ({ type: CATEGORY_PROGRESS });

export const categoryStatusFailed = (error) => ({
  type: CATEGORY_FAIL,
  payload: error
});

export const categoryStatusSuccessfully = (data) => ({
  type: CATEGORY_SUCCESS,
  payload: data
});
