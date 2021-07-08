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

  const getCategoryListFromConstant = (isSubCategory, key) => {
    const {
      admin: { category, subCategory },
    } = AppConstant;
    return key
      ? isSubCategory
        ? subCategory[key]
        : category[key]
      : isSubCategory
      ? subCategory
      : category;
  };

  useEffect(() => {
    setIncomeCategoryList(createCategoryList(false));
    setExpenseCategoryList(createCategoryList(true));
    setIncomeUserList(createUserList(false));
    setExpenseUserList(createUserList(true));
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
        getCategoryListFromConstant,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
