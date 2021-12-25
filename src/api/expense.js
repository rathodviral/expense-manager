import { AppApiFetch, AppConstant, AppStorage } from "../utilities";

const {
  login,
  expense: { apiPath },
} = AppConstant;

const { family } = AppStorage.getItemFromStorage(login.storage) || {
  family: null,
};

export default async function expenseApi(url, options) {
  let jsonData = null;
  try {
    const response = await AppApiFetch(url, options);
    jsonData = await response.json();
    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: jsonData.status,
        category:
          jsonData.data && jsonData.data.category
            ? jsonData.data.category
            : null,
        data:
          jsonData.data && jsonData.data.expense ? jsonData.data.expense : null,
        message: jsonData.message,
      };
    }
    throw new Error(response.statusText);
  } catch (err) {
    return Promise.reject(err.message ? err.message : jsonData);
  }
}

expenseApi.get = () => {
  const type = "category_only_all";
  const options = {
    method: "GET",
    queryParams: { family, type },
  };
  return expenseApi(apiPath.read, options);
};

expenseApi.post = (formData, isExpense) => {
  const options = {
    method: "POST",
    body: {
      ...formData,
      isExpense,
    },
    queryParams: { family },
  };

  return expenseApi(apiPath.create, options);
};

expenseApi.update = (formData) => {
  const options = {
    method: "PUT",
    body: { ...formData },
    queryParams: { family },
  };

  return expenseApi(apiPath.update, options);
};

expenseApi.delete = (id) => {
  const options = {
    method: "DELETE",
    queryParams: { family, id },
  };

  return expenseApi(apiPath.delete, options);
};
