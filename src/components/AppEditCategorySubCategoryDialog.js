import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
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
import { AppApiFetch, AppConstant, isFalsyValue } from "../utilities";
import { AdminContext, AppContext } from "../contexts";
import { AppButton, AppDivider, AppInputField } from ".";

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
  const history = useHistory();
  const { type } = useParams();

  const { getUserObject, showAlertDialogObj, showSnackbar } =
    useContext(AppContext);
  const { getListObj, getListFromConstant } = useContext(AdminContext);

  const { openDialog, dialogObj, toggleDialog, getAdminData } = props;
  const { isSubCategory, id, categoryId } = dialogObj;
  const isExpense = type === "expense";
  const defaultFields = getListFromConstant(isSubCategory, "fields");
  const [nameField, setNameField] = useState(null);
  const [detailField, setDetailField] = useState(null);
  console.log(dialogObj);
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
    const { isSubCategory, name } = dialogObj;
    const title = `${isSubCategory ? "Sub " : ""} Category`;
    const obj = {
      title: `Delete ${title}`,
      message: `Are you sure, you want to delete "${name}" ${title}.`,
      agreeBtnText: "Agree",
      disagreeBtnText: "Disagree",
      dialogBtnClick: alertBtnClickDeleteListItem,
    };
    showAlertDialogObj(obj);
  };

  const deleteListItem = async () => {
    const { isSubCategory, id } = dialogObj;
    const { family } = getUserObject();
    const {
      admin: { category, subCategory },
    } = AppConstant;
    const { apiPath } = isSubCategory ? subCategory : category;
    const options = {
      method: "DELETE",
      queryParams: { family, id },
    };
    const response = await AppApiFetch(apiPath.delete, options);
    const { status } = await response.json();
    if (status) {
      showSnackbar(`${isSubCategory ? "Sub " : ""} Category Deleted.`);
      getAdminData();
      toggleDialog(false);
    } else {
      showSnackbar("Some Issue");
    }
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
    const { update } = getListFromConstant(isSubCategory, "apiPath");
    const options = {
      method: "PUT",
      body: { ...formData, categoryId: isSubCategory ? categoryId : undefined },
      queryParams: { family },
    };
    const response = await AppApiFetch(update, options);
    const { status, message } = await response.json();
    showSnackbar(message);
    if (status) {
      getAdminData();
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
        {isSubCategory && (
          <Typography variant="h6" style={{ textAlign: "center" }}>
            Edit Sub Category for {getListObj(isExpense, categoryId, "name")}
          </Typography>
        )}
        {isSubCategory && <AppDivider />}
        <form noValidate autoComplete="off">
          <AppInputField {...nameField} handleChange={nameFieldChange} />
          <AppInputField {...detailField} handleChange={detailFieldChange} />
          <AppButton onClick={formSubmit}>Save Detail</AppButton>
          {!isSubCategory && (
            <AppButton onClick={(e) => history.push(`${type}/add/${id}`)}>
              Add Sub Category
            </AppButton>
          )}
        </form>
      </div>
    </Dialog>
  );
}
