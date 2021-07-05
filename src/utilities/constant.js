const AppConstant = {
  login: {
    apiPath: "auth.php",
    storage: "USER-INFO",
    fields: [
      {
        name: "username",
        label: "Username",
        type: "text",
        helperText: null,
        isDisabled: false,
        isError: false,
        value: "",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        helperText: null,
        isDisabled: false,
        isError: false,
        value: "",
      },
    ],
  },
  admin: {
    apiPath: {
      category: {
        read: "read.php",
      },
    },
  },
};
export default AppConstant;
