import React, { useContext, useState } from "react";
import { AppCard, AppInputField, AppButton } from "../../components";
import { useParams } from "react-router-dom";
import {
  AppApiFetch,
  AppConstant,
  setValuesInObject,
  validateObject,
} from "../../utilities";
import { AppContext } from "../../AppContext";
import { Typography } from "@material-ui/core";
import { AdminContext } from "../../AdminContext";

export default function AddCategorySubCategory(props) {
  const { getAdminData, showToaster } = props;
  const { type, categoryId } = useParams();
  const appCtx = useContext(AppContext);
  const { getListObj } = useContext(AdminContext);
  const isExpense = type === "expense";
  const isSubCategory = categoryId && categoryId !== "";
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

  const handleChange = (value, name) => {
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
      return;
    }
    const { family } = appCtx.getUserObject();
    const { create } = getList("apiPath");

    const options = {
      method: "POST",
      body: formData,
      queryParams: { family },
    };

    const response = await AppApiFetch(create, options);
    const { status } = await response.json();
    if (status) {
      getAdminData();
      setFormFields(getList("fields"));
    } else {
      showToaster("Some Issue");
      setFormFields(getList("fields"));
    }
  };

  return (
    <div>
      <AppCard title={`Add ${type} ${isSubCategory ? "Sub " : ""} Categories`}>
        {isSubCategory && (
          <Typography variant="h6" style={{ textAlign: "center" }}>
            {getListObj(isExpense, categoryId, "name")}
          </Typography>
        )}
        <form noValidate autoComplete="off">
          {formFields &&
            formFields.map((field, i) => (
              <AppInputField
                {...field}
                key={i}
                handleChange={handleChange}
              ></AppInputField>
            ))}
          <AppButton onClick={formSubmit}>
            Save {isSubCategory && "Sub "}Category
          </AppButton>
        </form>
      </AppCard>
    </div>
  );
}
