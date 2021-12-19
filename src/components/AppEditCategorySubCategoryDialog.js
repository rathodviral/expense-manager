import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { isFalsyValue } from "../utilities";
import { AdminContext, AppContext } from "../contexts";
import { AppButton, AppInputField } from ".";
import { categoryApi } from "../api";
import { useDispatch } from "react-redux";
import { fetchCategory } from "../reducers/category";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  saveButton: {
    marginLeft: "auto",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AppEditCategorySubCategoryDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { type } = useParams();

  const { showAlertDialogObj, showSnackbar } = useContext(AppContext);
  const { getListFromConstant } = useContext(AdminContext);

  const { openDialog, dialogObj, toggleDialog } = props;
  const { id } = dialogObj;
  const isExpense = type === "expense";
  const defaultFields = getListFromConstant("fields");
  const [nameField, setNameField] = useState(null);
  const [detailField, setDetailField] = useState(null);

  useEffect(() => {
    setValues(defaultFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogObj]);

  const getFormData = () => {
    return {
      name: nameField.value,
      detail: detailField.value,
      isExpense,
      isActive: true,
      id,
    };
  };

  const getFormFields = () => {
    return {
      nameField,
      detailField,
    };
  };

  const setValues = ({ name, detail }) => {
    setNameField({ ...name, value: dialogObj.name });
    setDetailField({ ...detail, value: dialogObj.detail });
  };

  const nameFieldChange = (value, name) => {
    const field = { ...nameField, value };
    setNameField(field);
  };

  const detailFieldChange = (value, name) => {
    const field = { ...detailField, value };
    setDetailField(field);
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
    if (key === "name") setNameField(obj);
    if (key === "detail") setDetailField(obj);
  };

  const alertBtnClickDeleteListItem = (isDelete) => {
    if (isDelete) {
      deleteListItem();
    }
  };

  const alertDeleteListItem = () => {
    const { name } = dialogObj;
    const obj = {
      title: `Delete Category`,
      message: `Are you sure, you want to delete "${name}" Category.`,
      agreeBtnText: "Agree",
      disagreeBtnText: "Disagree",
      dialogBtnClick: alertBtnClickDeleteListItem,
    };
    showAlertDialogObj(obj);
  };

  const deleteListItem = async () => {
    const formData = getFormData();
    const { status } = await categoryApi.delete(formData, id);
    if (status) {
      showSnackbar(`Category Deleted.`);
      dispatch(fetchCategory());
      toggleDialog(false);
    } else {
      showSnackbar("Some Issue");
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();
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
    const { status, message } = await categoryApi.update(formData, id);
    showSnackbar(message);
    if (status) {
      dispatch(fetchCategory());
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
          <Typography variant="h6" className={classes.title}>
            {dialogObj.name}
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
        <form noValidate autoComplete="off" onSubmit={formSubmit}>
          <AppInputField {...nameField} handleChange={nameFieldChange} />
          <AppInputField {...detailField} handleChange={detailFieldChange} />
          <AppButton>Save Detail</AppButton>
        </form>
      </div>
    </Dialog>
  );
}
