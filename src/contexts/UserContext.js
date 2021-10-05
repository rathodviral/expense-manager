import React, { createContext, useEffect, useState } from "react";
import { AppConstant } from "../utilities";
import { sortByDate } from "../utilities/common";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [userData, setUserData] = useState({
    subCategory: [],
    category: [],
    expense: [],
  });
  const [incomeCategoryList, setIncomeCategoryList] = useState([]);
  const [expenseCategoryList, setExpenseCategoryList] = useState([]);
  const [incomeUserList, setIncomeUserList] = useState([]);
  const [expenseUserList, setExpenseUserList] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalPaidExpense, setTotalPaidExpense] = useState(0);
  const [totalUnpaidExpense, setTotalUnpaidExpense] = useState(0);

  const createCategoryList = (isExpense, subCategoryAdd = true) => {
    const { category } = userData;
    const list = category.filter((x) => x.isExpense === isExpense);
    return subCategoryAdd
      ? list.map((x) => {
          return {
            ...x,
            isOpen: false,
          };
        })
      : list;
  };

  const createUserList = (isExpense) => {
    const { expense } = userData;
    const list = expense.filter((x) => x.isExpense === isExpense);
    const catList = createCategoryList(isExpense, false);
    // const subCatList = createSubCategoryList(isExpense);
    return list
      .map((x) => {
        const { category } = x;
        return {
          ...x,
          categoryName: catList.find((y) => y.id === category).name,
        };
      })
      .sort(sortByDate)
      .reverse();
  };

  const totalCalcuation = (isExpense, isPaid) => {
    const { expense } = userData;
    const list = expense.filter((x) => x.isExpense === isExpense);
    const filterdList =
      isPaid !== undefined
        ? list.filter((x) => x.isPaid === isPaid).map((x) => x.amount)
        : list.map((x) => x.amount);
    return filterdList.length > 0
      ? filterdList.reduce(
          (accumulator, currentValue) => accumulator + currentValue
        )
      : 0;
  };

  const getDataFromConstant = (key) => {
    const { expense } = AppConstant;
    return expense[key];
  };

  useEffect(() => {
    setIncomeCategoryList(createCategoryList(false));
    setExpenseCategoryList(createCategoryList(true));
    setIncomeUserList(createUserList(false));
    setExpenseUserList(createUserList(true));
    setTotalIncome(totalCalcuation(false));
    setTotalExpense(totalCalcuation(true));
    setTotalPaidExpense(totalCalcuation(true, true));
    setTotalUnpaidExpense(totalCalcuation(true, false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <UserContext.Provider
      value={{
        setUserData,
        incomeCategoryList,
        expenseCategoryList,
        incomeUserList,
        expenseUserList,
        getDataFromConstant,
        totalIncome,
        totalExpense,
        totalPaidExpense,
        totalUnpaidExpense,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
