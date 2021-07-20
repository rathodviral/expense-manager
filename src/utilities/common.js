export const validateObject = (formData, fields) => {
  return fields.map((x) => {
    if (!formData[x.name] || formData[x.name] === "") {
      return {
        ...x,
        isError: true,
        label: "Error",
        helperText: `Enter ${x.label}, it's required field`,
      };
    } else {
      return {
        ...x,
        value: formData[x.name],
      };
    }
  });
};

export const setEmptyObject = (fields) => {
  return fields.map((x) => {
    return {
      ...x,
      isError: false,
      value:
        fields.name === "note" || fields.name === "amount" ? "" : fields.value,
      // helperText: `${x.label}, Added`,
    };
  });
};

export const setValuesInObject = (formData, fields) => {
  return fields.map((x) => {
    return {
      ...x,
      isError: false,
      value: formData[x.name],
    };
  });
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
