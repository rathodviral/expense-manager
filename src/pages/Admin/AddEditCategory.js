import React, { useContext, useState, useEffect } from "react";
import { AppCard, AppInputField, AppButton } from "../../components";
import { useParams } from "react-router-dom";
import {
  AppApiFetch,
  AppConstant,
  validateObject,
  windowScrollTop,
} from "../../utilities";
import { AppContext } from "../../AppContext";
import { AdminContext } from "../../AdminContext";

export default function AddEditCategory(props) {
  const { getAdminData } = props;
  const { type, page, categoryId } = useParams();
  const appCtx = useContext(AppContext);
  const adminCtx = useContext(AdminContext);
  const defaultList = adminCtx[`${type}CategoryList`] || [];

  const isExpense = type === "expense";
  const isEdit = page === "edit";
  const {
    admin: { category },
  } = AppConstant;
  const defaultData = { name: "", detail: "", isExpense };
  const [formFields, setFormFields] = useState(category.fields);
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    windowScrollTop();
    if (isEdit) {
      if (defaultList.length > 0) {
        const modifiedFormData = defaultList.find((x) => x.id === categoryId);
        const modifiedFormsFields = category.fields.map((x) => {
          return {
            ...x,
            value: modifiedFormData[x.name],
          };
        });
        setFormFields(modifiedFormsFields);
        setFormData({
          name: modifiedFormData.name,
          detail: modifiedFormData.detail,
          isExpense: modifiedFormData.isExpense,
        });
        console.log(formData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultList]);

  const handleChange = (value, name) => {
    const modifiedFormdata = { ...formData, [name]: value };
    setFormData(modifiedFormdata);
  };

  const formSubmit = async () => {
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
      body: formData,
      queryParams: { family },
    };

    const response = await AppApiFetch(isEdit ? update : create, options);
    const { status } = await response.json();
    if (status) {
      getAdminData();
    } else {
      setFormFields(defaultData);
    }
  };

  return (
    <div>
      <AppCard title={`${page} ${type} Categories`}>
        <form noValidate autoComplete="off">
          {formFields.map((field, i) => (
            <AppInputField
              {...field}
              key={i}
              handleChange={handleChange}
            ></AppInputField>
          ))}
          <AppButton onClick={formSubmit}>Save Category</AppButton>
        </form>
      </AppCard>
    </div>
  );
}
