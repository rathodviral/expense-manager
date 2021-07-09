import React, { useContext, useState } from "react";
import { AppCard, AppInputField, AppButton } from "../../components";
import { useParams } from "react-router-dom";
import {
  AppApiFetch,
  setValuesInObject,
  validateObject,
} from "../../utilities";
import { Typography } from "@material-ui/core";
import { AdminContext, AppContext } from "../../contexts";

export default function AddCategorySubCategory(props) {
  const { getAdminData } = props;
  const { type, categoryId } = useParams();
  const { showSnackbar, getUserObject } = useContext(AppContext);
  const { getListObj, getListFromConstant } = useContext(AdminContext);
  const isExpense = type === "expense";
  const isSubCategory = categoryId && categoryId !== "";
  const listFields = getListFromConstant(isSubCategory, "fields");
  const [formFields, setFormFields] = useState(listFields);

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
    const fields = setValuesInObject(modifiedFormdata, listFields);
    setFormFields(fields);
  };

  const formSubmit = async () => {
    const formData = getFormData();
    if (Object.values(formData).some((item) => item === "")) {
      const fields = validateObject(formData, listFields);
      setFormFields(fields);
      return;
    }
    const { family } = getUserObject();
    const { create } = getListFromConstant("apiPath");

    const options = {
      method: "POST",
      body: formData,
      queryParams: { family },
    };

    const response = await AppApiFetch(create, options);
    const { status, message } = await response.json();
    showSnackbar(message);
    setFormFields(listFields);
    if (status) {
      getAdminData();
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
              <AppInputField {...field} key={i} handleChange={handleChange} />
            ))}
          <AppButton onClick={formSubmit}>
            Save {isSubCategory && "Sub "}Category
          </AppButton>
        </form>
      </AppCard>
    </div>
  );
}
