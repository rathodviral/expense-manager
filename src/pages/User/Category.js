import React, { useContext, useState, useEffect } from "react";
import { List } from "@material-ui/core";
import {
  AppCard,
  AppInputField,
  AppDivider,
  AppDialog,
  AppListItem,
  AppDateField,
  AppSelectField,
  AppButton,
} from "../../components";
import { UserContext } from "../../contexts";
import { useParams } from "react-router-dom";
import { AppDate, setValuesInObject, windowScrollTop } from "../../utilities";
import { getObjectFormData } from "../../utilities/common";

export default function Category(props) {
  const { getAdminData } = props;
  const { type } = useParams();
  const isExpense = type === "expense";
  const {
    incomeCategoryList,
    expenseCategoryList,
    incomeUserList,
    expenseUserList,
    getDataFromConstant,
  } = useContext(UserContext);
  const defailtFields = getDataFromConstant("listFields");
  const defaultList = isExpense ? expenseCategoryList : incomeCategoryList;
  const defaultExpenseList = isExpense ? expenseUserList : incomeUserList;

  const [expenseIncomeList, setExpenseIncomeList] = useState([]);

  const [defaultFormFields, setDefaultFormFields] = useState([]);
  const [formFields, setFormFields] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogObj, setDialogObj] = useState(false);

  useEffect(() => {
    windowScrollTop();
    resetFormExpenseIncomeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultList, defaultExpenseList]);

  const getOptions = (value) => {
    return {
      id: value.id || value,
      name: value.name || value,
    };
  };

  const sortByDate = (current, previous) =>
    new Date(previous.date) - new Date(current.date);

  const getUsersOptions = () => {
    const userList = defaultExpenseList.map((x) => x.user);
    const uniqUserList = [...new Set(userList)];
    return uniqUserList.map(getOptions);
  };

  const getCategoryOptions = () => {
    return defaultList.map(getOptions);
  };

  const getSubCategoryOptions = (category) => {
    const { subCategoryList } = defaultList.find((x) => x.id === category) || {
      subCategoryList: [],
    };
    return subCategoryList.map(getOptions);
  };

  const getFormData = (withFilter = false) => {
    return {
      isExpense,
      ...getObjectFormData(formFields, withFilter),
    };
  };

  const handleChange = (value, name) => {
    const formData = getFormData();
    const modifiedFormdata = { ...formData, [name]: value };
    if (name === "category") {
      modifiedFormdata.detail = null;
    }
    const fields = setValuesInObject(modifiedFormdata, defaultFormFields);
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

  const searchFormExpenseIncomeList = () => {
    const formData = getFormData(true);
    let list = defaultExpenseList;
    Object.keys(formData).forEach((x) => {
      const val = formData[x];
      if (val && val !== "") {
        list = list.filter((y) => y[x] === val);
      }
    });
    console.log(list, formData);
    // setExpenseIncomeList(list);
  };

  const resetFormExpenseIncomeList = () => {
    const fieldsWithOptions = defailtFields.map((element) => {
      const { name, type } = element;
      let list = [];
      if (name === "category") {
        list = getCategoryOptions();
      } else if (name === "user") {
        list = getUsersOptions();
      } else {
        list = element.options || [];
      }
      return {
        ...element,
        options: type === "select" ? list : null,
      };
    });
    setDefaultFormFields(fieldsWithOptions);
    setFormFields(fieldsWithOptions);

    setExpenseIncomeList(defaultExpenseList.sort(sortByDate));
  };

  const listItemClick = (isSubCategory, value) => {
    toggleDialog(true);
    setDialogObj({ ...value, isSubCategory });
  };

  const toggleDialog = (flag) => {
    setOpenDialog(flag);
  };

  return (
    <div>
      <AppCard title={`${type} Categories`}>
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
        </form>
        <AppButton onClick={searchFormExpenseIncomeList}>Search</AppButton>
        <AppButton onClick={resetFormExpenseIncomeList}>Reset</AppButton>
        <AppDivider />
        <List component="div" disablePadding>
          {expenseIncomeList.map((item, i) => (
            <AppListItem
              key={i}
              {...item}
              listItemClick={listItemClick}
            ></AppListItem>
          ))}
        </List>
        <AppDialog
          openDialog={openDialog}
          dialogObj={dialogObj}
          toggleDialog={toggleDialog}
          getAdminData={getAdminData}
        ></AppDialog>
      </AppCard>
    </div>
  );
}
