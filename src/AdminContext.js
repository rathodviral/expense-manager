import React, { createContext, useEffect, useState } from "react";

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
      };
    });
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
        incomeCategoryList,
        expenseCategoryList,
      }}
    >
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
