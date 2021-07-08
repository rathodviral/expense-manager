import React, { createContext, useEffect, useState } from "react";
import { AppConstant } from "../utilities";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [adminData, setAdminData] = useState({ subCategory: [], category: [] });
  const [incomeCategoryList, setIncomeCategoryList] = useState([]);
  const [expenseCategoryList, setExpenseCategoryList] = useState([]);

  const createList = (isExpense) => {
    const { category, subCategory } = adminData;
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

  const getListFromConstant = (isSubCategory, key) => {
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

  const getListObj = (isExpense, categoryId, key) => {
    const list = isExpense ? expenseCategoryList : incomeCategoryList;
    const obj = categoryId ? list.find((x) => x.id === categoryId) : list;
    return list.length > 0 ? (key && categoryId ? obj[key] : obj) : "";
  };

  useEffect(() => {
    setIncomeCategoryList(createList(false));
    setExpenseCategoryList(createList(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminData]);

  return (
    <AdminContext.Provider
      value={{
        setAdminData,
        getListObj,
        incomeCategoryList,
        expenseCategoryList,
        getListFromConstant,
      }}
    >
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
