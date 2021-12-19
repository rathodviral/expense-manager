import React, { useContext, useEffect, useState } from "react";
import {
  AppCard,
  AppInputField,
  AppButton,
  AppAutocompleteField,
  AppDateField,
} from "../../components";
import { useParams } from "react-router-dom";
import { AppApiFetch, AppDate } from "../../utilities";
import { FormControlLabel, Switch } from "@material-ui/core";
import { AppContext, UserContext } from "../../contexts";
import { createOptions, isFalsyValue } from "../../utilities/common";
import { useDispatch, useSelector } from "react-redux";
import {
  categoryExpenseList,
  categoryIncomeList,
  fetchExpense,
} from "../../reducers/expense";

export default function AddExpenseIncome(props) {
  const dispatch = useDispatch();
  const { type } = useParams();
  const { showSnackbar, getUserObject } = useContext(AppContext);
  const { getDataFromConstant } = useContext(UserContext);
  const expenseCategoryList = useSelector(categoryExpenseList);
  const incomeCategoryList = useSelector(categoryIncomeList);
  const isExpense = type === "expense";
  const defaultFields = getDataFromConstant("fields");
  const typeList = isExpense ? expenseCategoryList : incomeCategoryList;

  const [isPaid, setPaid] = useState(true);
  const [dateField, setDateField] = useState(null);
  const [categoryField, setCategoryField] = useState(defaultFields.category);
  // const [detailField, setDetailField] = useState(defaultFields.detail);
  const [amountField, setAmountField] = useState(null);
  const [noteField, setNoteField] = useState(null);

  useEffect(() => {
    if (categoryField.options.length === 0) {
      setValues(defaultFields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeList]);

  const getFormData = () => {
    return {
      date: AppDate.getDateIntoString(dateField.value),
      category:
        categoryField.value && categoryField.value.id
          ? categoryField.value.id
          : null,
      // detail:
      //   detailField.value && detailField.value.id ? detailField.value.id : null,
      amount: Number(amountField.value),
      note: noteField.value,
      isExpense,
      isPaid,
    };
  };

  const getFormFields = () => {
    return {
      dateField,
      categoryField,
      // detailField,
      amountField,
      noteField,
    };
  };

  const setValues = ({ date, category, detail, amount, note }) => {
    const categoryList = typeList.map(createOptions);
    const cField = {
      ...category,
      options: categoryList,
    };
    setDateField(date);
    setCategoryField(cField);
    // setDetailField(detail);
    setAmountField(amount);
    setNoteField(note);
  };

  // const setSubCategoryOptions = (categoryId) => {
  //   const { subCategoryList } = categoryId
  //     ? typeList.find((x) => x.id === categoryId)
  //     : {
  //         subCategoryList: [],
  //       };
  //   const subCatList = subCategoryList.map(createOptions);
  //   const sField = {
  //     ...detailField,
  //     options: subCatList,
  //     value: null,
  //   };
  //   setDetailField(sField);
  // };

  const dateFieldChange = (value, name) => {
    const field = { ...dateField, value };
    setDateField(field);
  };

  const categoryFieldChange = (value, name) => {
    const field = { ...categoryField, value };
    setCategoryField(field);
    // setSubCategoryOptions(value && value.id ? value.id : null);
  };

  // const subCategoryFieldChange = (value, name) => {
  //   const field = { ...detailField, value };
  //   setDetailField(field);
  // };

  const amountFieldChange = (value, name) => {
    const field = { ...amountField, value };
    setAmountField(field);
  };

  const noteFieldChange = (value, name) => {
    const field = { ...noteField, value };
    setNoteField(field);
  };

  const validateObject = (formObject) => {
    return {
      ...formObject,
      isError: true,
      label: "Error",
      helperText: `Enter ${formObject.label}, it's required field`,
    };
  };

  const updateFieldValue = (key, obj) => {
    if (key === "dateField") setDateField(obj);
    if (key === "categoryField") setCategoryField(obj);
    // if (key === "detailField") setDetailField(obj);
    if (key === "amountField") setAmountField(obj);
    if (key === "noteField") setNoteField(obj);
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const formFields = getFormFields();
    const formData = getFormData();
    if (Object.values(formData).some((item) => isFalsyValue(item))) {
      Object.keys(formFields).forEach((item) => {
        const field = formFields[item];
        const fieldObj = isFalsyValue(field.value)
          ? validateObject(field)
          : field;
        updateFieldValue(item, fieldObj);
      });
      return;
    }
    const { family, username } = getUserObject();
    const { create } = getDataFromConstant("apiPath");

    const options = {
      method: "POST",
      body: { ...formData, user: username },
      queryParams: { family },
    };
    const response = await AppApiFetch(create, options);
    const { status, message } = await response.json();
    showSnackbar(message);
    if (status) {
      setValues({
        ...defaultFields,
        category: categoryField,
        date: dateField,
        // detail: detailField,
      });
      // getUserDataEvent();
      dispatch(fetchExpense());
    }
  };

  return (
    <div>
      <AppCard title={`Add ${type}`}>
        <form noValidate autoComplete="off" onClick={formSubmit}>
          <AppDateField
            {...dateField}
            minDate={AppDate.getLast3MonthsDates}
            handleChange={dateFieldChange}
          />
          <AppAutocompleteField
            {...categoryField}
            handleChange={categoryFieldChange}
          />
          {/* <AppAutocompleteField
            {...detailField}
            handleChange={subCategoryFieldChange}
          /> */}
          <AppInputField {...amountField} handleChange={amountFieldChange} />
          <AppInputField {...noteField} handleChange={noteFieldChange} />
          {isExpense && (
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
          )}
          <AppButton>Save {type}</AppButton>
        </form>
      </AppCard>
    </div>
  );
}
