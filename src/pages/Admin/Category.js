import React, { useState, useEffect } from "react";
import { List } from "@material-ui/core";
import {
  AppCard,
  AppInputField,
  AppDivider,
  AppEditCategorySubCategoryDialog,
  AppCategoryListItem,
  AppSpinner,
} from "../../components";
import { useParams } from "react-router-dom";
import { windowScrollTop } from "../../utilities";
import { useSelector } from "react-redux";
import {
  expenseList,
  incomeList,
  showAdminLoader,
} from "../../reducers/category";

export default function Category(props) {
  const { getAdminData } = props;
  const { type } = useParams();
  const expenseCategoryList = useSelector(expenseList);
  const incomeCategoryList = useSelector(incomeList);
  const defaultList =
    type === "expense" ? expenseCategoryList : incomeCategoryList;

  const showSpinner = useSelector(showAdminLoader);

  const [categoryList, setCategoryList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogObj, setDialogObj] = useState(false);

  useEffect(() => {
    windowScrollTop();
    setCategoryList(defaultList);
  }, [defaultList]);

  const handleChange = (value) => {
    setSearchText(value);
    const list =
      value !== ""
        ? defaultList.filter((x) => x.name.toLowerCase().includes(value))
        : [...defaultList];
    setCategoryList(list);
  };

  const listItemClick = (value) => {
    toggleDialog(true);
    setDialogObj({ ...value });
  };

  const toggleDialog = (flag) => {
    setOpenDialog(flag);
  };

  return (
    <div>
      <AppCard title={`${type} Categories`}>
        <AppInputField
          name="search"
          label="Search Categories"
          type="search"
          helperText={null}
          isDisabled={false}
          isError={false}
          value={searchText}
          handleChange={handleChange}
        ></AppInputField>
        <AppDivider />
        <List component="div" disablePadding>
          {categoryList.map((item, i) => (
            <AppCategoryListItem
              key={i}
              {...item}
              listItemClick={listItemClick}
            ></AppCategoryListItem>
          ))}
        </List>
        <AppEditCategorySubCategoryDialog
          openDialog={openDialog}
          dialogObj={dialogObj}
          toggleDialog={toggleDialog}
          getAdminData={getAdminData}
        ></AppEditCategorySubCategoryDialog>
      </AppCard>
      {showSpinner && <AppSpinner />}
    </div>
  );
}
