import React, { useContext, useState } from "react";
import { AppCard, AppInputField, AppButton } from "../../components";
import { useParams } from "react-router-dom";
import {
  AppApiFetch,
  setValuesInFields,
  validateObject,
  getValuesFromFields,
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
  const defaultFields = getListFromConstant(isSubCategory, "fields");

  const [categoryFormFields, setCategoryFormFields] = useState(defaultFields);

  const handleChange = (value, name) => {
    const formData = getValuesFromFields(categoryFormFields);
    const modifiedFormdata = { ...formData, [name]: value };
    const fields = setValuesInFields(modifiedFormdata, defaultFields);
    setCategoryFormFields(fields);
  };

  const formSubmit = async () => {
    const formData = getValuesFromFields(categoryFormFields);
    if (Object.values(formData).some((item) => item === "")) {
      const fields = validateObject(formData, categoryFormFields);
      setCategoryFormFields(fields);
      return;
    }
    const { family } = getUserObject();
    const { create } = getListFromConstant("apiPath");
    const options = {
      method: "POST",
      body: {
        ...formData,
        isExpense,
        categoryId: isSubCategory ? categoryId : undefined,
      },
      queryParams: { family },
    };

    const response = await AppApiFetch(create, options);
    const { status, message } = await response.json();
    showSnackbar(message);
    setCategoryFormFields(defaultFields);
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
          {categoryFormFields &&
            categoryFormFields.map((field, i) => (
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
