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
import { windowScrollTop } from "../../utilities";
import { createOptions, isValueNullOrUndefined } from "../../utilities/common";

export default function ExpenseIncomeList(props) {
  const { getUserData } = props;
  const { type } = useParams();
  const isExpense = type === "expense";
  const {
    incomeCategoryList,
    expenseCategoryList,
    incomeUserList,
    expenseUserList,
  } = useContext(UserContext);
  const defaultCategoryList = isExpense
    ? expenseCategoryList
    : incomeCategoryList;
  const defaultExpenseList = isExpense ? expenseUserList : incomeUserList;

  const [expenseIncomeList, setExpenseIncomeList] = useState([]);

  const [openEditItemDialog, setOpenEditItemDialog] = useState(false);
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

  const resetButtonClick = () => {
    setExpenseIncomeList(defaultExpenseList.sort(sortByDate));
    if (editObj) {
      const { id } = editObj;
      const newEditObj = defaultExpenseList.find((x) => x.id === id);
      setEditObj(newEditObj);
    }
  };

  const showEditItemDialog = (id) => {
    toggleEditItemDialog(true);
    setEditObj({ ...expenseIncomeList.find((x) => x.id === id) });
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
          console.log(val);
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
          getUserData={getUserData}
          defaultList={defaultCategoryList}
        ></AppEditExpenseIncomeDialog>
        <AppFilterDialog
          openDialog={openFilterDialog}
          toggleDialog={toggleFilterDialog}
          title={`Filter ${type} List`}
          emitEvents={emitEvents}
          defaultList={defaultCategoryList}
          userList={getUsersOptions()}
        ></AppFilterDialog>
      </AppCard>
    </div>
  );
}
