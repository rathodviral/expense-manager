import React, { createContext, useEffect, useState } from "react";
import { AppConstant } from "../utilities";

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

  const createCategoryList = (isExpense) => {
    const { category, subCategory } = userData;
    const list = category.filter((x) => x.isExpense === isExpense);
    return list.map((x) => {
      const subCategoryList = subCategory.filter((y) => y.categoryId === x.id);
      return {
        ...x,
        subCategoryList: subCategoryList,
        isOpen: false,
      };
    });
  };

  const createUserList = (isExpense) => {
    const { expense } = userData;
    return expense.filter((x) => x.isExpense === isExpense);
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
