import React, { useContext, useEffect, useState } from "react";
import {
  AppCard,
  AppInputField,
  AppButton,
  AppAutocompleteField,
  AppDateField,
} from "../../components";
import { useParams } from "react-router-dom";
import { AppApiFetch, AppConstant, AppDate } from "../../utilities";
import { FormControlLabel, Switch, Box } from "@material-ui/core";
import { AppContext, UserContext } from "../../contexts";
import { createOptions } from "../../utilities/common";

export default function Report(props) {
  const { getDataEvent } = props;
  const { showSnackbar, getUserObject } = useContext(AppContext);
  const { incomeCategoryList, expenseCategoryList } = useContext(UserContext);

  const { type } = useParams();
  const isExpense = type === "expense";
  const typeList = isExpense ? expenseCategoryList : incomeCategoryList;

  const { report } = AppConstant;
  const defaultFields = { ...report.fields };
  const [isPaid, setPaid] = useState(true);
  const [startDateField, setStartDateField] = useState(null);
  const [endDateField, setEndDateField] = useState(null);
  const [categoryField, setCategoryField] = useState(defaultFields.category);
  const [detailField, setDetailField] = useState(defaultFields.detail);
  const [amountField, setAmountField] = useState(null);

  useEffect(() => {
    if (typeList.length > 0) {
      setValues(defaultFields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeList]);

  const getFormData = () => {
    return {
      start: AppDate.getDateIntoString(startDateField.value),
      end: AppDate.getDateIntoString(endDateField.value),
    };
  };

  const setValues = ({ startDate, endDate, category, detail, amount }) => {
    const categoryList = typeList.map(createOptions);
    const cField = {
      ...category,
      options: categoryList,
    };
    const { start } = AppDate.getCurrentMonthDates;

    setStartDateField({ ...startDate, value: start });
    setEndDateField(endDate);
    setCategoryField(cField);
    setDetailField(detail);
    setAmountField(amount);
  };

  const setSubCategoryOptions = (categoryId) => {
    const { subCategoryList } = categoryId
      ? typeList.find((x) => x.id === categoryId)
      : {
          subCategoryList: [],
        };
    const subCatList = subCategoryList.map(createOptions);
    const sField = {
      ...detailField,
      options: subCatList,
      value: null,
    };
    setDetailField(sField);
  };

  const startDateFieldChange = (value, name) => {
    const field = { ...startDateField, value };
    setStartDateField(field);
  };

  const endDateFieldChange = (value, name) => {
    const field = { ...amountField, value };
    setEndDateField(field);
  };

  const categoryFieldChange = (value, name) => {
    const field = { ...categoryField, value };
    setCategoryField(field);
    setSubCategoryOptions(value && value.id ? value.id : null);
  };

  const subCategoryFieldChange = (value, name) => {
    const field = { ...detailField, value };
    setDetailField(field);
  };

  const amountFieldChange = (value, name) => {
    const field = { ...amountField, value };
    setAmountField(field);
  };

  const validateObject = (formObject, defaultFields) => {
    return {
      ...formObject,
      isError: true,
      label: "Error",
      helperText: `Enter ${formObject.label}, it's required field`,
    };
  };

  const formSubmit = async () => {
    if (!startDateField.value || startDateField.value === "") {
      const field = validateObject(startDateField);
      setStartDateField(field);
      return;
    }
    if (!endDateField.value || endDateField.value === "") {
      const field = validateObject(endDateField);
      setEndDateField(field);
      return;
    }
    const { family, username } = getUserObject();
    // const { create } = report.apiPath;
    const formData = getFormData();
    const options = {
      method: "POST",
      body: { ...formData, user: username },
      queryParams: { family },
    };

    console.log(options);
    // const response = await AppApiFetch(create, options);
    // const { status, message } = await response.json();
    // showSnackbar(message);
    // if (status) {
    //   getDataEvent();
    // }
  };

  return (
    <div>
      <AppCard title={`Report`}>
        <form noValidate autoComplete="off">
          <Box display="flex" flexDirection="row">
            <Box pr={1} width="50%">
              <AppDateField
                {...startDateField}
                minDate={AppDate.getPreviousThreeMonth}
                handleChange={startDateFieldChange}
              />
            </Box>
            <Box pl={1} width="50%">
              <AppDateField
                {...endDateField}
                minDate={AppDate.getPreviousThreeMonth}
                handleChange={endDateFieldChange}
              />
            </Box>
          </Box>

          <AppAutocompleteField
            {...categoryField}
            handleChange={categoryFieldChange}
          />
          <AppAutocompleteField
            {...detailField}
            handleChange={subCategoryFieldChange}
          />
          <AppInputField {...amountField} handleChange={amountFieldChange} />
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
          <Box display="flex" flexDirection="row">
            <Box pr={1} width="50%">
              <AppButton onClick={formSubmit}>Search</AppButton>
            </Box>
            <Box pl={1} width="50%">
              <AppButton
                onClick={(e) => {
                  setValues(defaultFields);
                }}
              >
                Reset
              </AppButton>
            </Box>
          </Box>
        </form>
      </AppCard>
    </div>
  );
}
