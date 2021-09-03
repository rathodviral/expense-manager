import React, { useContext, useState, useEffect } from "react";
import {
  makeStyles,
  IconButton,
  Typography,
  Slide,
  Dialog,
  AppBar,
  Toolbar,
  FormControlLabel,
  Switch,
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
  getValuesFromFields,
  setValuesInFields,
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

  const { openDialog, toggleDialog, editObj, getUserData, defaultList } = props;

  const { subCategoryName, id, categoryName, isExpense, user, note } = editObj;
  const title = `Edit ${isExpense ? "Expense" : "Income"} ${subCategoryName}`;

  const { getDataFromConstant } = useContext(UserContext);
  const { getUserObject, showAlertDialogObj, showSnackbar } =
    useContext(AppContext);

  const defaultFields = getDataFromConstant("fields");
  const [formFields, setFormFields] = useState([]);
  const [isPaid, setPaid] = useState(false);

  useEffect(() => {
    const fields = setValues();
    setPaid(editObj.isPaid);
    setFormFields(fields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editObj]);

  const setValues = () => {
    const list = defaultList.map(getOptions);
    const subList = getSubCategoryOptions(editObj.category);
    return defaultFields.map((x) => {
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
        options:
          x.name === "category"
            ? list
            : name === "detail"
            ? subList
            : x.options || null,
      };
    });
  };

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
      showSnackbar(`${isExpense ? "Expense" : "Income"} Deleted.`);
      getUserData();
      toggleDialog(false);
    } else {
      showSnackbar("Some Issue");
    }
  };

  const formSubmit = async () => {
    const formData = {
      ...getValuesFromFields(formFields, true),
    };

    if (Object.values(formData).some((item) => item === "" || item === null)) {
      const dFields = setValues();
      const fields = validateObject(formData, dFields);
      console.log(fields);
      setFormFields(fields);
      return;
    }
    const { family, username } = getUserObject();
    const { update } = getDataFromConstant("apiPath");
    const noteSplit = formData.note.split("--");
    const options = {
      method: "PUT",
      body: {
        ...formData,
        isPaid,
        id,
        user,
        isExpense,
        note:
          user !== username
            ? `${
                noteSplit.length > 0 ? noteSplit[0] : note
              }--Updated by ${username}`
            : formData.note,
      },
      queryParams: { family },
    };

    const response = await AppApiFetch(update, options);
    const { status, message } = await response.json();
    showSnackbar(message);
    if (status) {
      getUserData();
      toggleDialog(false);
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
      ...getValuesFromFields(formFields),
    };
    const modifiedFormdata = { ...formData, [name]: value };
    if (name === "category") {
      modifiedFormdata.detail = null;
    }
    const fields = setValuesInFields(modifiedFormdata, defaultFields);
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
        <FormControlLabel
          control={
            <Switch
              checked={isPaid}
              onChange={(e) => setPaid(e.target.checked)}
              name="checkedB"
              color="primary"
            />
          }
          label={isPaid ? "Paid" : "Not Paid"}
        />
        <AppButton onClick={() => formSubmit()}>
          Update {isExpense ? "Expense" : "Income"}
        </AppButton>
      </div>
    </Dialog>
  );
}
