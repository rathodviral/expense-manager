import React, { useContext, useState, useEffect } from "react";
import { AppInputField, AppButton, AppDivider } from ".";
import { useHistory, useParams } from "react-router-dom";
import {
  AppApiFetch,
  setValuesInFields,
  validateObject,
  getValuesFromFields,
} from "../utilities";
import { Typography } from "@material-ui/core";
import { AdminContext, AppContext } from "../contexts";

export default function EditListItem(props) {
  const { getAdminData, isSubCategory, id, name, detail, categoryId } = props;
  const history = useHistory();
  const { type } = useParams();
  const { showSnackbar, getUserObject } = useContext(AppContext);
  const { getListObj, getListFromConstant } = useContext(AdminContext);
  const isExpense = type === "expense";
  const defaultFields = getListFromConstant(isSubCategory, "fields");

  const [formFields, setFormFields] = useState(defaultFields);

  useEffect(() => {
    updateFieldsValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFieldsValue = () => {
    const formData = { name, detail };
    const fields = defaultFields.map((x) => {
      return {
        ...x,
        value: formData[x.name],
      };
    });
    setFormFields(fields);
  };

  const InputChange = (value, name) => {
    const formData = getValuesFromFields(formFields);
    const modifiedFormdata = { ...formData, [name]: value };
    const fields = setValuesInFields(modifiedFormdata, defaultFields);
    setFormFields(fields);
  };

  const formSubmit = async () => {
    const formData = getValuesFromFields(formFields);
    if (Object.values(formData).some((item) => item === "")) {
      const fields = validateObject(formData, defaultFields);
      setFormFields(fields);
      return;
    }
    const { family } = getUserObject();
    const { update } = getListFromConstant("apiPath");
    const options = {
      method: "PUT",
      body: {
        ...formData,
        isExpense,
        categoryId: isSubCategory ? categoryId : undefined,
        isActive: true,
        id,
      },
      queryParams: { family },
    };

    const response = await AppApiFetch(update, options);
    const { status, message } = await response.json();
    showSnackbar(message);
    if (status) {
      getAdminData();
    } else {
      setFormFields(defaultFields);
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
