import AppDate from "./date";

export const validateObject = (formObject, defaultFields) => {
  return defaultFields.map((x) => {
    if (!formObject[x.name] || formObject[x.name] === "") {
      return {
        ...x,
        value: formObject[x.name],
        isError: true,
        label: "Error",
        helperText: `Enter ${x.label}, it's required field`,
      };
    } else {
      return {
        ...x,
      };
    }
  });
};

export const setEmptyObject = (defaultFields) => {
  return defaultFields.map((x) => {
    return {
      ...x,
      isError: false,
      value:
        defaultFields.name === "note" || defaultFields.name === "amount"
          ? ""
          : defaultFields.value,
    };
  });
};

export const setValuesInFields = (formObject, defaultFields) => {
  return defaultFields.map((x) => {
    return {
      ...x,
      isError: false,
      value: formObject[x.name],
    };
  });
};

export const getValuesFromFields = (fields, withFilter = false) => {
  let obj = {};
  fields.forEach((field) => {
    const { name, value, type } = field;
    if (withFilter) {
      if (type === "select") {
        obj[name] =
          value && isValueNullOrUndefined(value.id) ? value.id : value;
      } else if (type === "date") {
        obj[name] = value ? AppDate.getDateIntoString(value) : null;
      } else {
        if (name === "amount") {
          obj[name] = Number(value);
        } else {
          obj[name] = value;
        }
      }
    } else {
      obj[name] = value;
    }
  });
  return obj;
};

export const windowScrollTop = (formData, fields) => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
};

export const getCurrencyFormat = (count) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(count);
};

export const isValueNullOrUndefined = (value) => {
  return value !== null && value !== undefined;
};

export const isFalsyValue = (value) => {
  return value === null || value === undefined || value === "";
};

export const createOptions = (value) => {
  return {
    id: value.id || value,
    name: value.name || value,
  };
};

export const sortByDate = (current, previous) =>
  new Date(previous.date) - new Date(current.date);

export const getUsersOptions = (list) => {
  const userList = list.map((x) => x.user);
  const uniqUserList = [...new Set(userList)];
  return uniqUserList.map(createOptions);
};

export const getTotal = (list) => {
  return list && list.length > 0
    ? list
        .map((x) => x.amount)
        .reduce((accumulator, currentValue) => accumulator + currentValue)
    : 0;
};
