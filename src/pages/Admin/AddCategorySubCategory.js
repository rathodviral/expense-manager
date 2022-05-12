import React, { useContext, useState, useEffect } from "react";
import { AppCard, AppInputField, AppButton } from "../../components";
import { useParams } from "react-router-dom";
import { AdminContext, AppContext } from "../../contexts";
import { categoryApi } from "../../api";
import { isFalsyValue } from "../../utilities";

export default function AddCategorySubCategory({
  loadCategories,
  loading,
  expenseTypeList,
  incomeTypeList
}) {
  const { type } = useParams();
  const { showSnackbar } = useContext(AppContext);
  const { getListFromConstant } = useContext(AdminContext);
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
      detail: detailField.value
    };
  };

  const getFormFields = () => {
    return {
      nameField,
      detailField
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
      helperText: `Enter ${formObject.label}, it's required field`
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
    const { status, message } = await categoryApi.post(formData, isExpense);
    showSnackbar(message);
    setValues(defaultFields);
    if (status) {
      loadCategories();
    }
  };

  return (
    <div>
      <AppCard>
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
