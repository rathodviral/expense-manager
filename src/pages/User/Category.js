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
import { setValuesInObject, windowScrollTop } from "../../utilities";
import {
  getObjectFormData,
  isValueNullOrUndefined,
} from "../../utilities/common";

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
  const defaultFields = getDataFromConstant("listFields");
  const defaultList = isExpense ? expenseCategoryList : incomeCategoryList;
  const defaultExpenseList = isExpense ? expenseUserList : incomeUserList;

  const [expenseIncomeList, setExpenseIncomeList] = useState([]);

  const [defaultFormFields, setDefaultFormFields] = useState([]);
  const [formFields, setFormFields] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [editObj, setEditObj] = useState({ category: "" });

  useEffect(() => {
    windowScrollTop();
    resetButtonClick();
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

  const filterButtonClick = () => {
    const formData = getFormData(true);
    console.log(formData);
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
  };

  const getEditItemDialog = (isSubCategory, obj) => {
    toggleDialog(true);
    setEditObj({ ...obj });
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
          editObj={{ ...editObj, type }}
          getAdminData={getAdminData}
          defaultList={defaultList}
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
