import React, { useContext, useState, useEffect } from "react";
import { AppCard, AppInputField, AppButton } from "../../components";
import { useParams } from "react-router-dom";
import {
  AppApiFetch,
  AppConstant,
  setValuesInObject,
  validateObject,
  windowScrollTop,
} from "../../utilities";
import { AppContext } from "../../AppContext";
import { AdminContext } from "../../AdminContext";

export default function AddEditSubCategory(props) {
  const { getAdminData, showToaster } = props;
  const { type, page, categoryId } = useParams();
  const appCtx = useContext(AppContext);
  const adminCtx = useContext(AdminContext);
  const categoryList = adminCtx[`${type}CategoryList`] || [];
  const isExpense = type === "expense";
  const isEdit = page === "edit";
  const {
    admin: { category },
  } = AppConstant;
  const [formFields, setFormFields] = useState(category.fields);

  useEffect(() => {
    if (isEdit && categoryList.length > 0) {
      updateFieldsValue();
    }
    if (!isEdit && categoryList.length > 0) {
      setFormFields(category.fields);
    }
    windowScrollTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryList]);

  const updateFieldsValue = () => {
    const mFormData = categoryList.find((x) => x.id === categoryId);
    const mFormsFields = category.fields.map((x) => {
      return {
        ...x,
        value: mFormData[x.name],
      };
    });
    setFormFields(mFormsFields);
  };

  const getFormData = () => {
    let obj = { isExpense };
    formFields.forEach((field) => {
      const { name, value } = field;
      obj[name] = value;
    });
    return obj;
  };

  const handleChange = (value, name) => {
    const formData = getFormData();
    const modifiedFormdata = { ...formData, [name]: value };
    const fields = setValuesInObject(modifiedFormdata, [...category.fields]);
    setFormFields(fields);
  };

  const formSubmit = async () => {
    const formData = getFormData();
    if (Object.values(formData).some((item) => item === "")) {
      const fields = validateObject(formData, [...category.fields]);
      setFormFields(fields);
      return;
    }
    const { family } = appCtx.getUserObject();
    const {
      apiPath: { update, create },
    } = category;
    const options = {
      method: isEdit ? "PUT" : "POST",
      body: isEdit ? { ...formData, isActive: true, id: categoryId } : formData,
      queryParams: { family },
    };

    const response = await AppApiFetch(isEdit ? update : create, options);
    const { status } = await response.json();
    if (status) {
      getAdminData();
    } else {
      showToaster("Some Issue");
      setFormFields(category.fields);
    }
  };

  return (
    <div>
      <AppCard title={`${page} ${type} Sub Categories`}>
        <form noValidate autoComplete="off">
          {formFields &&
            formFields.map((field, i) => (
              <AppInputField
                {...field}
                key={i}
                handleChange={handleChange}
              ></AppInputField>
            ))}
          <AppButton onClick={formSubmit}>Save Sub Category</AppButton>
        </form>
      </AppCard>
    </div>
  );
}
