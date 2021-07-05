import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { AppInputField, AppCard, AppButton } from "../components";
import {
  AppConstant,
  AppApiFetch,
  AppStorage,
  validateObject,
} from "../utilities";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    height: "100vh",
    flexDirection: "column",
  },
});

export default function Login() {
  const classes = useStyles();
  const history = useHistory();

  const { login } = AppConstant;
  const [formFields, setFormFields] = useState(login.fields);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (value, type) => {
    const modifiedFormdata = { ...formData, [type]: value };
    setFormData(modifiedFormdata);
  };

  const formSubmit = async () => {
    if (Object.keys(formData).some((x) => formData[x] === "")) {
      const fields = validateObject(formData, login.fields);
      setFormFields(fields);
      return;
    }
    const options = {
      method: "POST",
      body: formData,
    };

    const response = await AppApiFetch(login.apiPath, options);
    const { status, data } = await response.json();
    if (status) {
      const { isAdmin } = data;
      AppStorage.setItemInStorage(login.storage, data);
      if (isAdmin) {
        history.replace({ pathname: "/admin/dashboard" });
      } else {
        history.replace({ pathname: "/user/dashboard" });
      }
    }
  };

  return (
    <div className={classes.root}>
      <AppCard title="Expense Manager">
        <form noValidate autoComplete="off">
          {formFields.map((field, i) => (
            <AppInputField
              {...field}
              key={i}
              handleChange={handleChange}
            ></AppInputField>
          ))}
          <AppButton onClick={formSubmit}>Login</AppButton>
        </form>
      </AppCard>
    </div>
  );
}
