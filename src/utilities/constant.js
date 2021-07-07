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
        create: "category/create.php",
        update: "category/update.php",
        delete: "category/delete.php",
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
    subCategory: {
      apiPath: {
        create: "sub_category/create.php",
        update: "sub_category/update.php",
        delete: "sub_category/delete.php",
      },
      fields: [
        {
          name: "name",
          label: "Sub Category Name",
          type: "text",
          helperText: null,
          isDisabled: false,
          isError: false,
          multiline: false,
          value: "",
        },
        {
          name: "detail",
          label: "Sub Category Detail",
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
