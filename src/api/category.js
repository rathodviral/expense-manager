import { AppApiFetch, AppConstant, AppStorage } from "../utilities";

const {
  login,
  admin: {
    category: { apiPath }
  }
} = AppConstant;

const { family } = AppStorage.getItemFromStorage(login.storage) || {
  family: null
};

export default async function categoryApi(url, options) {
  let jsonData = null;
  try {
    const response = await AppApiFetch(url, options);
    jsonData = await response.json();
    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: jsonData.status,
        data:
          jsonData.data && jsonData.data.category
            ? jsonData.data.category
            : null,
        message: jsonData.message
      };
    }
    throw new Error(response.statusText);
  } catch (err) {
    return Promise.reject(err.message ? err.message : jsonData);
  }
}

categoryApi.get = () => {
  const { family } = AppStorage.getItemFromStorage(login.storage);
  console.log(family);
  const type = "category_only";
  const options = {
    method: "GET",
    queryParams: { family, type }
  };
  return categoryApi(apiPath.read, options);
};

categoryApi.post = (formData, isExpense) => {
  const options = {
    method: "POST",
    body: {
      ...formData,
      isExpense
    },
    queryParams: { family }
  };

  return categoryApi(apiPath.create, options);
};

categoryApi.update = (formData, categoryId) => {
  const options = {
    method: "PUT",
    body: { ...formData, categoryId },
    queryParams: { family }
  };

  return categoryApi(apiPath.update, options);
};

categoryApi.delete = (formData, categoryId) => {
  const options = {
    method: "PUT",
    body: { ...formData, categoryId, isActive: false },
    queryParams: { family }
  };

  return categoryApi(apiPath.update, options);
};
