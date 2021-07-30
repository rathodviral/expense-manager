import React, { useContext, useState, useEffect } from "react";
import {
  makeStyles,
  IconButton,
  Typography,
  Slide,
  Dialog,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import AppDateField from "./AppDateField";
import AppSelectField from "./AppSelectField";
import AppInputField from "./AppInputField";
import AppButton from "./AppButton";
import { AppContext, UserContext } from "../contexts";
import { AppApiFetch, AppConstant } from "../utilities";
import {
  getObjectFormData,
  setValuesInObject,
  validateObject,
} from "../utilities/common";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  saveButton: {
    marginLeft: "auto",
  },
  title: {
    textTransform: "capitalize",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AppEditExpenseIncomeDialog(props) {
  const classes = useStyles();

  const { openDialog, toggleDialog, editObj, getAdminData, defaultList } =
    props;

  const { subCategoryName, type, id, categoryName } = editObj;
  const title = `Edit ${type} ${subCategoryName}`;

  const { getUserObject, getDataFromConstant } = useContext(UserContext);
  const { showAlertDialogObj, showSnackbar } = useContext(AppContext);

  const defaultFields = getDataFromConstant("fields");
  const [defaultFormFields, setDefaultFormFields] = useState([]);
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    const fields = defaultFields.map((x) => {
      const { name } = x;
      return {
        ...x,
        value:
          name === "category" || name === "detail"
            ? {
                id: editObj[name],
                name: name === "category" ? categoryName : subCategoryName,
              }
            : editObj[name],
      };
    });
    setFormFields(fields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFields]);

  const alertBtnClickDeleteListItem = (isDelete) => {
    if (isDelete) {
      deleteListItem("delete");
    }
  };

  const alertDeleteListItem = () => {
    const obj = {
      title: `Delete ${title}`,
      message: `Are you sure, you want to delete ${title}.`,
      agreeBtnText: "Agree",
      disagreeBtnText: "Disagree",
      dialogBtnClick: alertBtnClickDeleteListItem,
    };
    showAlertDialogObj(obj);
  };

  const deleteListItem = async () => {
    const { id } = editObj;
    const { family } = getUserObject();
    const {
      expense: { apiPath },
    } = AppConstant;
    const options = {
      method: "DELETE",
      queryParams: { family, id },
    };
    const response = await AppApiFetch(apiPath.delete, options);
    const { status } = await response.json();
    if (status) {
      showSnackbar(`${type} Deleted.`);
      getAdminData();
      toggleDialog(false);
    } else {
      showSnackbar("Some Issue");
    }
  };

  const formSubmit = async () => {
    const formData = {
      ...getObjectFormData(formFields),
    };
    if (Object.values(formData).some((item) => item === "")) {
      const fields = validateObject(formData, defaultFields);
      setFormFields(fields);
      return;
    }
    const { family } = getUserObject();
    const { update } = getDataFromConstant("apiPath");
    const options = {
      method: "PUT",
      body: { ...formData, isActive: true, id },
      queryParams: { family },
    };

    const response = await AppApiFetch(update, options);
    const { status, message } = await response.json();
    showSnackbar(message);
    if (status) {
      getAdminData();
    } else {
      setFormFields(defaultFields);
    }
  };

  const getOptions = (value) => {
    return {
      id: value.id || value,
      name: value.name || value,
    };
  };

  const getSubCategoryOptions = (category) => {
    const { subCategoryList } = defaultList.find((x) => x.id === category) || {
      subCategoryList: [],
    };
    return subCategoryList.map(getOptions);
  };

  const handleChange = (value, name) => {
    const formData = {
      ...getObjectFormData(formFields),
    };
    const modifiedFormdata = { ...formData, [name]: value };
    if (name === "category") {
      modifiedFormdata.detail = null;
    }
    const fields = setValuesInObject(modifiedFormdata, defaultFormFields);
    if (modifiedFormdata.category && modifiedFormdata.category.id) {
      const subList = modifiedFormdata.category.id
        ? getSubCategoryOptions(modifiedFormdata.category.id)
        : [];
      const fieldsWithOptions = fields.map((element) => {
        return {
          ...element,
          options: element.name === "detail" ? subList : element.options,
        };
      });
      setFormFields(fieldsWithOptions);
    } else {
      setFormFields(fields);
    }
  };

  return (
    <Dialog
      fullScreen
      open={openDialog}
      onClose={(e) => toggleDialog(false)}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={(e) => toggleDialog(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} noWrap={true}>
            {title}
          </Typography>
          <IconButton
            className={classes.saveButton}
            edge="start"
            color="inherit"
            onClick={(e) => alertDeleteListItem()}
            aria-label="close"
          >
            <DeleteIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={{ padding: "1rem" }}>
        <form noValidate autoComplete="off">
          {formFields &&
            formFields.map((field, i) => {
              if (field.type === "date") {
                return (
                  <AppDateField
                    {...field}
                    key={i}
                    handleChange={handleChange}
                  />
                );
              } else if (field.type === "select") {
                return (
                  <AppSelectField
                    {...field}
                    key={i}
                    handleChange={handleChange}
                  />
                );
              } else {
                return (
                  <AppInputField
                    {...field}
                    key={i}
                    handleChange={handleChange}
                  />
                );
              }
            })}
        </form>
        <AppButton onClick={() => formSubmit()}>Save</AppButton>
      </div>
    </Dialog>
  );
}
