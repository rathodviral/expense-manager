export const validateObject = (formData, fields) => {
  return fields.map((x) => {
    if (formData[x.name] === "") {
      return {
        ...x,
        isError: true,
        label: "Error",
        helperText: `Enter ${x.label}, it's required field`,
      };
    } else {
      return x;
    }
  });
};
export const windowScrollTop = (formData, fields) => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 300);
};
