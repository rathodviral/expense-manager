import React, { useContext, useState, useEffect } from "react";
import { AppCard, AppInputField, AppButton } from "../../components";
import { useParams } from "react-router-dom";
import { AppApiFetch, isFalsyValue } from "../../utilities";
import { Typography } from "@material-ui/core";
import { AdminContext, AppContext } from "../../contexts";
import { categoryApi } from "../../api";
import { useDispatch } from "react-redux";
import { fetchCategory } from "../../reducers/category";

export default function AddCategorySubCategory(props) {
  const { getAdminData } = props;
  const dispatch = useDispatch();
  const { type, categoryId } = useParams();
  const { showSnackbar, getUserObject } = useContext(AppContext);
  const { getListObj, getListFromConstant } = useContext(AdminContext);
  const isExpense = type === "expense";
  // const isSubCategory = categoryId && categoryId !== "";
  const defaultFields = getListFromConstant("fields");

  const [nameField, setNameField] = useState(null);
  const [detailField, setDetailField] = useState(null);

  useEffect(() => {
    setValues(defaultFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFields]);

  const getFormData = () => {
    return {
      name: nameField.value,
      detail: detailField.value,
    };
  };

  const getFormFields = () => {
    return {
      nameField,
      detailField,
    };
  };

  const setValues = ({ name, detail }) => {
    setNameField(name);
    setDetailField(detail);
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
    // const response = await AppApiFetch(create, options);
    const { status, message } = await categoryApi.post(formData, isExpense);
    // const { status, message } = await response.json();
    showSnackbar(message);
    setValues(defaultFields);
    if (status) {
      // getAdminData();
      dispatch(fetchCategory());
    }
  };

  return (
    <div>
      <AppCard title={`Add ${type} Categories`}>
        {/* {isSubCategory && (
          <Typography variant="h6" style={{ textAlign: "center" }}>
            {getListObj(isExpense, categoryId, "name")}
          </Typography>
        )} */}
        <form noValidate autoComplete="off" onSubmit={formSubmit}>
          <AppInputField {...nameField} handleChange={nameFieldChange} />
          <AppInputField {...detailField} handleChange={detailFieldChange} />
          <AppButton>Save Category</AppButton>
        </form>
      </AppCard>
    </div>
  );
}
