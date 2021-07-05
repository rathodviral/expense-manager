import React, { createContext, useEffect, useState } from "react";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [adminData, setAdminData] = useState({ subCategory: [], category: [] });
  const [incomeCategoryList, setIncomeCategoryList] = useState([]);
  const [expenseCategoryList, setExpenseCategoryList] = useState([]);

  const createList = (isExpense) => {
    const { category, subCategory } = adminData;
    return category.filter((x) => {
      const subCategoryList = subCategory.filter((y) => y.categoryId === x.id);
      if (x.isExpense === isExpense) {
        return {
          ...x,
          subCategoryList,
        };
      }
    });
  };

  useEffect(() => {
    console.log(adminData);
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
