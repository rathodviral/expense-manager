import React, { useContext, useEffect, useState } from "react";
import {
  AppCard,
  AppInputField,
  AppButton,
  AppSelectField,
  AppDateField,
} from "../../components";
import { useParams } from "react-router-dom";
import {
  AppApiFetch,
  setValuesInFields,
  validateObject,
} from "../../utilities";
import { FormControlLabel, Switch } from "@material-ui/core";
import { AppContext, UserContext } from "../../contexts";
import { createOptions, getValuesFromFields } from "../../utilities/common";

export default function AddExpenseIncome(props) {
  const { getUserDataEvent } = props;
  const { type } = useParams();
  const { showSnackbar, getUserObject } = useContext(AppContext);
  const { incomeCategoryList, expenseCategoryList, getDataFromConstant } =
    useContext(UserContext);
  const isExpense = type === "expense";
  const defailtFields = getDataFromConstant("fields");
  const typeList = isExpense ? expenseCategoryList : incomeCategoryList;
  const [modifiedFields, setModifiedFields] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [isPaid, setPaid] = useState(true);

  useEffect(() => {
    const list = getCategoryOptions();
    const fieldsWithOptions = defailtFields.map((element) => {
      return {
        ...element,
        options: element.name === "category" ? list : element.options || null,
      };
    });
    setModifiedFields(fieldsWithOptions);
    setFormFields(fieldsWithOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomeCategoryList, expenseCategoryList]);

  const getCategoryOptions = () => {
    return typeList.map(createOptions);
  };

  const getSubCategoryOptions = (category) => {
    const { subCategoryList } = typeList.find((x) => x.id === category) || {
      subCategoryList: [],
    };
    return subCategoryList.map(createOptions);
  };

  const handleChange = (value, name) => {
    const formData = getValuesFromFields(formFields);
    const modifiedFormdata = { ...formData, [name]: value };
    if (name === "category") {
      modifiedFormdata.detail = null;
    }
    const fields = setValuesInFields(modifiedFormdata, modifiedFields);
    setFieldValueChange(modifiedFormdata, fields);
  };

  const setFieldValueChange = (modifiedFormdata, fields) => {
    if (modifiedFormdata.category && modifiedFormdata.category.id) {
      const subList = modifiedFormdata.category.id
        ? getSubCategoryOptions(modifiedFormdata.category.id)
        : [];
      const fieldsWithOptions = fields.map((element) => {
        return {
          ...element,
          options: element.name === "detail" ? subList : element.options,
        };
      });
      setFormFields(fieldsWithOptions);
    } else {
      setFormFields(fields);
    }
  };

  const formSubmit = async () => {
    const formData = getValuesFromFields(formFields, true);

    if (Object.values(formData).some((item) => !item || item === "")) {
      const fD = getValuesFromFields(formFields);
      const fields = validateObject(fD, modifiedFields);
      setFieldValueChange(fD, fields);
      return;
    }
    const { family, username } = getUserObject();
    const { create } = getDataFromConstant("apiPath");

    const options = {
      method: "POST",
      body: { ...formData, isExpense, user: username, isPaid },
      queryParams: { family },
    };

    const response = await AppApiFetch(create, options);
    const { status, message } = await response.json();
    showSnackbar(message);
    if (status) {
      const fD = getValuesFromFields(formFields);
      fD.note = "";
      fD.amount = "";
      const fields = setValuesInFields(fD, modifiedFields);
      setFieldValueChange(fD, fields);
      getUserDataEvent();
    }
  };

  return (
    <div>
      <AppCard title={`Add ${type}`}>
        <form noValidate autoComplete="off">
          {formFields &&
            formFields.map((field, i) => {
              if (field.type === "date") {
                return (
                  <AppDateField
                    {...field}
                    key={i}
                    handleChange={handleChange}
                  />
                );
              } else if (field.type === "select") {
                return (
                  <AppSelectField
                    {...field}
                    key={i}
                    handleChange={handleChange}
                  />
                );
              } else {
                return (
                  <AppInputField
                    {...field}
                    key={i}
                    handleChange={handleChange}
                  />
                );
              }
            })}
          <FormControlLabel
            control={
              <Switch
                checked={isPaid}
                onChange={(e) => setPaid(e.target.checked)}
                name="checkedB"
                color="primary"
              />
            }
            label={isPaid ? "Paid" : "Not Paid"}
          />
          <AppButton onClick={formSubmit}>Save {type}</AppButton>
        </form>
      </AppCard>
    </div>
  );
}
