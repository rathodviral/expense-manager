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
import AppAutocompleteField from "./AppAutocompleteField";
import AppInputField from "./AppInputField";
import AppButton from "./AppButton";
import { AppContext, UserContext } from "../contexts";
import { AppApiFetch, AppConstant, AppDate } from "../utilities";
import { createOptions, isFalsyValue } from "../utilities/common";

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
  const { getDataFromConstant } = useContext(UserContext);
  const { getUserObject, showAlertDialogObj, showSnackbar } =
    useContext(AppContext);

  const { openDialog, toggleDialog, editObj, getUserData, defaultList } = props;
  const { id, isExpense, user } = editObj;
  const title = `Edit ${isExpense ? "Expense" : "Income"} ${
    editObj.subCategoryName
  }`;
  const defaultFields = getDataFromConstant("fields");

  const [isPaid, setPaid] = useState(true);
  const [dateField, setDateField] = useState(null);
  const [categoryField, setCategoryField] = useState(defaultFields.category);
  const [detailField, setDetailField] = useState(defaultFields.detail);
  const [amountField, setAmountField] = useState(null);
  const [noteField, setNoteField] = useState(null);

  useEffect(() => {
    if (id) {
      setPaid(editObj.isPaid);
      setValues(defaultFields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editObj]);

  const getFormData = () => {
    const { username } = getUserObject();
    const [noteSplit] = noteField.value.split("--");
    return {
      date: AppDate.getDateIntoString(dateField.value),
      category:
        categoryField.value && categoryField.value.id
          ? categoryField.value.id
          : null,
      detail:
        detailField.value && detailField.value.id ? detailField.value.id : null,
      amount: Number(amountField.value),
      note:
        user !== username ? `${noteSplit}--Updated by ${username}` : noteSplit,
      isExpense,
      isPaid,
      id,
      user,
    };
  };

  const getFormFields = () => {
    return {
      dateField,
      categoryField,
      detailField,
      amountField,
      noteField,
    };
  };

  const setValues = ({ date, category, detail, amount, note }) => {
    const { subCategoryName, categoryName } = editObj;
    const categoryList = defaultList.map(createOptions);
    const categoryItem = categoryList.find((x) => x.name === categoryName);
    const cField = {
      ...category,
      options: categoryList,
      value: categoryItem,
    };
    const { subCategoryList } = defaultList.find(
      (x) => x.id === categoryItem.id
    );
    const subCatList = subCategoryList.map(createOptions);
    const subCatItem = subCatList.find((x) => x.name === subCategoryName);
    const sField = {
      ...detail,
      options: subCatList,
      value: subCatItem,
    };
    setDetailField(sField);
    setDateField(date);
    setCategoryField(cField);
    setDetailField(sField);
    setAmountField({ ...amount, value: editObj.amount });
    setNoteField({ ...note, value: editObj.note });
  };

  const setSubCategoryOptions = (categoryId) => {
    const { subCategoryList } = categoryId
      ? defaultList.find((x) => x.id === categoryId)
      : {
          subCategoryList: [],
        };
    const subCatList = subCategoryList.map(createOptions);
    const sField = {
      ...detailField,
      options: subCatList,
      value: null,
    };
    setDetailField(sField);
  };

  const dateFieldChange = (value, name) => {
    const field = { ...dateField, value };
    setDateField(field);
  };

  const categoryFieldChange = (value, name) => {
    const field = { ...categoryField, value };
    setCategoryField(field);
    setSubCategoryOptions(value && value.id ? value.id : null);
  };

  const subCategoryFieldChange = (value, name) => {
    const field = { ...detailField, value };
    setDetailField(field);
  };

  const amountFieldChange = (value, name) => {
    const field = { ...amountField, value };
    setAmountField(field);
  };

  const noteFieldChange = (value, name) => {
    const field = { ...noteField, value };
    setNoteField(field);
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

  const validateObject = (formObject) => {
    return {
      ...formObject,
      isError: true,
      label: "Error",
      helperText: `Enter ${formObject.label}, it's required field`,
    };
  };

  const updateFieldValue = (key, obj) => {
    if (key === "dateField") setDateField(obj);
    if (key === "categoryField") setCategoryField(obj);
    if (key === "detailField") setDetailField(obj);
    if (key === "amountField") setAmountField(obj);
    if (key === "noteField") setNoteField(obj);
  };

  const formSubmit = async () => {
    const formFields = getFormFields();
    const formData = getFormData();
    if (Object.values(formData).some((item) => isFalsyValue(item))) {
      Object.keys(formFields).forEach((item) => {
        const field = formFields[item];
        const fieldObj = isFalsyValue(field.value)
          ? validateObject(field)
          : field;
        updateFieldValue(item, fieldObj);
      });
      return;
    }
    const { family } = getUserObject();
    const { update } = getDataFromConstant("apiPath");
    const options = {
      method: "PUT",
      body: formData,
      queryParams: { family },
    };
    const response = await AppApiFetch(update, options);
    const { status, message } = await response.json();
    showSnackbar(message);
    if (status) {
      getUserData();
      // toggleDialog(false);
    } else {
      setValues(defaultFields);
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
          <AppDateField
            {...dateField}
            minDate={AppDate.getLast3MonthsDates}
            handleChange={dateFieldChange}
          />

          <AppAutocompleteField
            {...categoryField}
            handleChange={categoryFieldChange}
          />
          <AppAutocompleteField
            {...detailField}
            handleChange={subCategoryFieldChange}
          />
          <AppInputField {...amountField} handleChange={amountFieldChange} />
          <AppInputField {...noteField} handleChange={noteFieldChange} />
          {isExpense && (
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
          )}
        </form>

        <AppButton onClick={() => formSubmit()}>
          Update {isExpense ? "Expense" : "Income"}
        </AppButton>
      </div>
    </Dialog>
  );
}
