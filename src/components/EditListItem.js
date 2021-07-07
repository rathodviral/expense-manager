import React, { useContext, useState, useEffect } from "react";
import { AppInputField, AppButton, AppDivider } from ".";
import { useHistory, useParams } from "react-router-dom";
import {
  AppApiFetch,
  AppConstant,
  setValuesInObject,
  validateObject,
} from "../utilities";
import { AppContext } from "../AppContext";
import { Typography } from "@material-ui/core";
import { AdminContext } from "../AdminContext";

export default function EditListItem(props) {
  const {
    getAdminData,
    showToaster,
    isSubCategory,
    id,
    name,
    detail,
    categoryId,
  } = props;
  const history = useHistory();
  const { type } = useParams();
  const appCtx = useContext(AppContext);
  const { getListObj } = useContext(AdminContext);
  const isExpense = type === "expense";
  const {
    admin: { category, subCategory },
  } = AppConstant;

  const getList = (key) => {
    return key
      ? isSubCategory
        ? subCategory[key]
        : category[key]
      : isSubCategory
      ? subCategory
      : category;
  };

  const [formFields, setFormFields] = useState(getList("fields"));

  useEffect(() => {
    updateFieldsValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFieldsValue = () => {
    const mFormData = { name, detail };
    const fields = getList("fields");
    const mFormsFields = fields.map((x) => {
      return {
        ...x,
        value: mFormData[x.name],
      };
    });
    setFormFields(mFormsFields);
  };

  const getFormData = () => {
    let obj = { isExpense };
    if (isSubCategory) {
      obj["categoryId"] = categoryId;
    }
    formFields.forEach((field) => {
      const { name, value } = field;
      obj[name] = value;
    });
    return obj;
  };

  const InputChange = (value, name) => {
    const formData = getFormData();
    const modifiedFormdata = { ...formData, [name]: value };
    const fields = setValuesInObject(modifiedFormdata, getList("fields"));
    setFormFields(fields);
  };

  const formSubmit = async () => {
    const formData = getFormData();
    if (Object.values(formData).some((item) => item === "")) {
      const fields = validateObject(formData, getList("fields"));
      setFormFields(fields);
      console.log(fields);

      return;
    }
    const { family } = appCtx.getUserObject();
    const { update } = getList("apiPath");
    const options = {
      method: "PUT",
      body: { ...formData, isActive: true, id },
      queryParams: { family },
    };

    const response = await AppApiFetch(update, options);
    const { status } = await response.json();
    if (status) {
      getAdminData();
    } else {
      showToaster("Some Issue");
      setFormFields(category.fields);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      {isSubCategory && (
        <Typography variant="h6" style={{ textAlign: "center" }}>
          Edit Sub Category for {getListObj(isExpense, categoryId, "name")}
        </Typography>
      )}
      {isSubCategory && <AppDivider />}
      <form noValidate autoComplete="off">
        {formFields &&
          formFields.map((field, i) => (
            <AppInputField
              {...field}
              key={i}
              handleChange={InputChange}
            ></AppInputField>
          ))}
        <AppButton onClick={formSubmit}>Save Detail</AppButton>
        {!isSubCategory && (
          <AppButton onClick={(e) => history.push(`${type}/add/${id}`)}>
            Add Sub Category
          </AppButton>
        )}
      </form>
    </div>
  );
}
