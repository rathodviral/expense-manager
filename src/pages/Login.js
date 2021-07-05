import React, { useState } from "react";
import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  Button,
} from "@material-ui/core";
import { AppInputField, AppDivider } from "../components";
import { AppConstant, AppApiFetch, AppStorage } from "../utilities";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    height: "100vh",
    flexDirection: "column",
  },
  card: {
    position: "relative",
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    textAlign: "center",
    textTransform: "uppercase",
  },
  button: {
    marginTop: 16,
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
      const fields = login.fields.map((x) => {
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
      const appStorage = AppStorage();
      const { isAdmin } = data;
      appStorage.setItemInStorage(login.storage, data);
      if (isAdmin) {
        history.replace({ pathname: "/admin/dashboard" });
      } else {
        history.replace({ pathname: "/user/dashboard" });
      }
    }
  };

  return (
    <div className={classes.root}>
      <Card className={classes.card} variant="outlined">
        <CardContent>
          <Typography className={classes.title}>Expense Manager</Typography>
          <AppDivider />
          <form noValidate autoComplete="off">
            {formFields.map((field, i) => (
              <AppInputField
                {...field}
                key={i}
                handleChange={handleChange}
              ></AppInputField>
            ))}
            <Button
              type="button"
              variant="contained"
              color="primary"
              className={classes.button}
              fullWidth
              onClick={formSubmit}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
