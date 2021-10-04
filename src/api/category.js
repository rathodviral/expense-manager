import { AppApiFetch, AppConstant, AppStorage } from "../utilities";

const {
  login,
  admin: {
    category: { apiPath },
  },
} = AppConstant;

const { family } = AppStorage.getItemFromStorage(login.storage) || {
  family: null,
};

export default async function categoryApi(options) {
  let jsonData = null;
  try {
    const response = await AppApiFetch(apiPath.read, options);
    jsonData = await response.json();
    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: jsonData.status,
        data: jsonData.data.category,
        message: jsonData.message,
      };
    }
    throw new Error(response.statusText);
  } catch (err) {
    return Promise.reject(err.message ? err.message : jsonData);
  }
}

categoryApi.get = () => {
  const type = "category";
  const options = {
    method: "GET",
    queryParams: { family, type },
  };
  return categoryApi(options);
};

categoryApi.post = (formData, isExpense) => {
  const options = {
    method: "POST",
    body: {
      ...formData,
      isExpense,
    },
    queryParams: { family },
  };

  return categoryApi(options);
};
