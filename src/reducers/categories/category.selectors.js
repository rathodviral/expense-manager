export const getCategories = (state) => state.categories;

export const getExpenseTypeCategories = (state) => {
  const { data } = getCategories(state);
  return data.filter((x) => x.isExpense);
};

export const getIncomeTypeCategories = (state) => {
  const { data } = getCategories(state);
  return data.filter((x) => !x.isExpense);
};

export const isCategoriesLoad = (state) => {
  console.log(state);
  const { loading } = getCategories(state);
  return loading;
};
