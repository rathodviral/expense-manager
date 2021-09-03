import React, { useContext, useState, useEffect } from "react";
import { List } from "@material-ui/core";
import {
  AppCard,
  AppDivider,
  AppEditExpenseIncomeDialog,
  AppListItem,
  AppCurrencyCountText,
  AppFilterDialog,
} from "../../components";
import { UserContext } from "../../contexts";
import { useParams } from "react-router-dom";
import { setValuesInFields, windowScrollTop } from "../../utilities";
import {
  createOptions,
  getValuesFromFields,
  isValueNullOrUndefined,
} from "../../utilities/common";

export default function ExpenseIncomeList(props) {
  const { getUserData } = props;
  const { type } = useParams();
  const isExpense = type === "expense";
  const {
    incomeCategoryList,
    expenseCategoryList,
    incomeUserList,
    expenseUserList,
    getDataFromConstant,
  } = useContext(UserContext);
  const defaultFields = getDataFromConstant("listFields");
  const defaultCategoryList = isExpense
    ? expenseCategoryList
    : incomeCategoryList;
  const defaultExpenseList = isExpense ? expenseUserList : incomeUserList;

  const [expenseIncomeList, setExpenseIncomeList] = useState([]);

  const [defaultFormFields, setDefaultFormFields] = useState([]);
  const [formFields, setFormFields] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [editObj, setEditObj] = useState(null);

  useEffect(() => {
    windowScrollTop();
    resetButtonClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCategoryList, defaultExpenseList]);

  const sortByDate = (current, previous) =>
    new Date(previous.date) - new Date(current.date);

  const getUsersOptions = () => {
    const userList = defaultExpenseList.map((x) => x.user);
    const uniqUserList = [...new Set(userList)];
    return uniqUserList.map(createOptions);
  };

  const getCategoryOptions = () => {
    return defaultCategoryList.map(createOptions);
  };

  const getSubCategoryOptions = (category) => {
    const { subCategoryList } = defaultCategoryList.find(
      (x) => x.id === category
    ) || {
      subCategoryList: [],
    };
    return subCategoryList.map(createOptions);
  };

  const getFormData = (withFilter = false) => {
    return {
      ...getValuesFromFields(formFields, withFilter),
    };
  };

  const handleChange = (value, name) => {
    const formData = getFormData();
    const modifiedFormdata = { ...formData, [name]: value };
    if (name === "category") {
      modifiedFormdata.detail = null;
    }
    const fields = setValuesInFields(modifiedFormdata, defaultFormFields);
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

  const filterButtonClick = () => {
    const formData = getFormData(true);
    let list = [...defaultExpenseList];
    Object.keys(formData).forEach((x) => {
      const val = formData[x];
      if (isValueNullOrUndefined(val)) {
        list = list.filter((y) => y[x] === val);
      }
    });
    setExpenseIncomeList(list);
    toggleFilterDialog(false);
  };

  const resetButtonClick = () => {
    const fieldsWithOptions = defaultFields.map((element) => {
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
    if (editObj) {
      const { id } = editObj;
      const newEditObj = defaultExpenseList.find((x) => x.id === id);
      setEditObj(newEditObj);
    }
  };

  const getEditItemDialog = (id) => {
    toggleDialog(true);
    setEditObj({ ...expenseIncomeList.find((x) => x.id === id) });
  };

  const getFilterDialog = () => {
    toggleFilterDialog(true);
  };

  const toggleDialog = (flag) => {
    setOpenDialog(flag);
  };

  const toggleFilterDialog = (flag) => {
    setOpenFilterDialog(flag);
  };

  const emitEvents = (type) => {
    if (type === "filter") {
      filterButtonClick();
    } else if (type === "reset") {
      resetButtonClick();
    }
  };

  const getTotal = () => {
    return expenseIncomeList.length > 0
      ? expenseIncomeList
          .map((x) => x.amount)
          .reduce((accumulator, currentValue) => accumulator + currentValue)
      : 0;
  };

  return (
    <div>
      <AppCard title={`${type} List`}>
        <AppCurrencyCountText
          count={getTotal()}
          type={type}
          onClick={(e) => getFilterDialog()}
        ></AppCurrencyCountText>
        <AppDivider />
        <List component="div" disablePadding>
          {expenseIncomeList.map((item, i) => (
            <AppListItem
              key={i}
              {...item}
              listItemClick={getEditItemDialog}
            ></AppListItem>
          ))}
        </List>
        <AppEditExpenseIncomeDialog
          openDialog={openDialog}
          toggleDialog={toggleDialog}
          editObj={{ ...editObj, isExpense }}
          getUserData={getUserData}
          defaultList={defaultCategoryList}
        ></AppEditExpenseIncomeDialog>
        <AppFilterDialog
          openDialog={openFilterDialog}
          toggleDialog={toggleFilterDialog}
          title={`Filter ${type} List`}
          formFields={formFields}
          handleChange={handleChange}
          emitEvents={emitEvents}
          isFilter={true}
        ></AppFilterDialog>
      </AppCard>
    </div>
  );
}
