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
        multiline: false,
        value: "",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        helperText: null,
        isDisabled: false,
        isError: false,
        multiline: false,
        value: "",
      },
    ],
  },
  admin: {
    category: {
      apiPath: {
        read: "read.php",
        create: "create.php",
        update: "update.php",
      },
      fields: [
        {
          name: "name",
          label: "Category Name",
          type: "text",
          helperText: null,
          isDisabled: false,
          isError: false,
          multiline: false,
          value: "",
        },
        {
          name: "detail",
          label: "Category Detail",
          type: "text",
          helperText: null,
          isDisabled: false,
          isError: false,
          multiline: true,
          rows: 4,
          value: "",
        },
      ],
    },
  },
};
export default AppConstant;
