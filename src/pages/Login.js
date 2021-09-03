import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { AppInputField, AppCard, AppButton } from "../components";
import {
  AppConstant,
  AppApiFetch,
  AppStorage,
  validateObject,
  setValuesInFields,
  getValuesFromFields,
} from "../utilities";
import { useHistory } from "react-router-dom";
import { AppContext } from "../contexts";

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
  const { showSnackbar } = useContext(AppContext);
  const { login } = AppConstant;
  const defaultFields = login.fields;

  const [loginFormFields, setLoginFormFields] = useState(defaultFields);

  const handleChange = (value, type) => {
    const formData = getValuesFromFields(loginFormFields);
    const modifiedFormdata = { ...formData, [type]: value };
    const fields = setValuesInFields(modifiedFormdata, defaultFields);
    setLoginFormFields(fields);
  };

  const formSubmit = async () => {
    const formData = getValuesFromFields(loginFormFields);
    if (Object.values(formData).some((item) => item === "")) {
      const fields = validateObject(formData, loginFormFields);
      setLoginFormFields(fields);
      return;
    }

    const options = {
      method: "POST",
      body: formData,
    };
    const response = await AppApiFetch(login.apiPath, options);
    const { status, data, message } = await response.json();
    if (status) {
      const { isAdmin } = data;
      AppStorage.setItemInStorage(login.storage, data);
      if (isAdmin) {
        history.replace({ pathname: "/admin" });
      } else {
        history.replace({ pathname: "/user" });
      }
    } else {
      showSnackbar(message);
    }
  };

  return (
    <div className={classes.root}>
      <AppCard title="Expense Manager">
        <form noValidate autoComplete="off">
          {loginFormFields.map((field, i) => (
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
