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
import { UserContext, AppContext } from "../../contexts";
import { useParams } from "react-router-dom";
import { windowScrollTop } from "../../utilities";
import {
  isValueNullOrUndefined,
  getUsersOptions,
} from "../../utilities/common";
import { useSelector } from "react-redux";
import {
  categoryExpenseList,
  categoryIncomeList,
  userExpenseList,
  userIncomeList,
} from "../../reducers/expense";

export default function ExpenseIncomeList(props) {
  const { getUserObject } = useContext(AppContext);
  const { username, isAdmin } = getUserObject();
  const { type } = useParams();
  const isExpense = type === "expense";
  const {
    // incomeCategoryList,
    // expenseCategoryList,
    // incomeUserList,
    // expenseUserList,
    getDataFromConstant,
  } = useContext(UserContext);
  const expenseCategoryList = useSelector(categoryExpenseList);
  const incomeCategoryList = useSelector(categoryIncomeList);
  const incomeUserList = useSelector(userIncomeList);
  const expenseUserList = useSelector(userExpenseList);
  const defaultCategoryList = isExpense
    ? expenseCategoryList
    : incomeCategoryList;
  const defaultExpenseList = isExpense ? expenseUserList : incomeUserList;

  const defaultFields = getDataFromConstant("listFields");

  const [expenseIncomeList, setExpenseIncomeList] = useState([]);

  const [openEditItemDialog, setOpenEditItemDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [editObj, setEditObj] = useState(null);

  useEffect(() => {
    windowScrollTop();
    resetButtonClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCategoryList, defaultExpenseList]);

  const resetButtonClick = () => {
    setExpenseIncomeList(defaultExpenseList);
    if (editObj) {
      const { id } = editObj;
      const newEditObj = defaultExpenseList.find((x) => x.id === id);
      setEditObj(newEditObj);
    }
  };

  const showEditItemDialog = (id) => {
    const expIncomeObj = expenseIncomeList.find((x) => x.id === id);
    if (username === expIncomeObj.user || isAdmin) {
      toggleEditItemDialog(true);
      setEditObj({ ...expIncomeObj });
    }
  };

  const showFilterDialog = () => {
    toggleFilterDialog(true);
  };

  const toggleEditItemDialog = (flag) => {
    setOpenEditItemDialog(flag);
  };

  const toggleFilterDialog = (flag) => {
    setOpenFilterDialog(flag);
  };

  const emitEvents = (obj) => {
    if (obj === "reset") {
      resetButtonClick();
    } else {
      let list = [...defaultExpenseList];
      Object.keys(obj).forEach((x) => {
        const val = obj[x];
        if (isValueNullOrUndefined(val)) {
          list = list.filter((y) => y[x] === val);
        }
      });
      setExpenseIncomeList(list);
      toggleFilterDialog(false);
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
          onClick={showFilterDialog}
        ></AppCurrencyCountText>
        <AppDivider />
        <List component="div" disablePadding>
          {expenseIncomeList.map((item, i) => (
            <AppListItem
              key={i}
              {...item}
              listItemClick={showEditItemDialog}
            ></AppListItem>
          ))}
        </List>
        <AppEditExpenseIncomeDialog
          openDialog={openEditItemDialog}
          toggleDialog={toggleEditItemDialog}
          editObj={{ ...editObj, isExpense }}
          defaultList={defaultCategoryList}
        ></AppEditExpenseIncomeDialog>
        <AppFilterDialog
          openDialog={openFilterDialog}
          toggleDialog={toggleFilterDialog}
          title={`Filter ${type} List`}
          emitEvents={emitEvents}
          defaultList={defaultCategoryList}
          userList={getUsersOptions(defaultExpenseList)}
          defaultFields={defaultFields}
        ></AppFilterDialog>
      </AppCard>
    </div>
  );
}
