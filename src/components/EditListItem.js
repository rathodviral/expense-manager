import React, { useContext, useState, useEffect } from "react";
import { AppInputField, AppButton, AppDivider } from ".";
import { useHistory, useParams } from "react-router-dom";
import { AppApiFetch, setValuesInObject, validateObject } from "../utilities";
import { Typography } from "@material-ui/core";
import { AdminContext, AppContext } from "../contexts";

export default function EditListItem(props) {
  const { getAdminData, isSubCategory, id, name, detail, categoryId } = props;
  const history = useHistory();
  const { type } = useParams();
  const { showSnackbar, getUserObject } = useContext(AppContext);
  const { getListObj, getListFromConstant } = useContext(AdminContext);
  const isExpense = type === "expense";
  const listFields = getListFromConstant(isSubCategory, "fields");

  const [formFields, setFormFields] = useState(listFields);

  useEffect(() => {
    updateFieldsValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFieldsValue = () => {
    const mFormData = { name, detail };
    const mFormsFields = listFields.map((x) => {
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
    const { update } = getListFromConstant("apiPath");
    const options = {
      method: "PUT",
      body: { ...formData, isActive: true, id },
      queryParams: { family },
    };

    const response = await AppApiFetch(update, options);
    const { status, message } = await response.json();
    showSnackbar(message);
    if (status) {
      getAdminData();
    } else {
      setFormFields(listFields);
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
