import React, { useState, useEffect } from "react";
import { List } from "@material-ui/core";
import {
  AppCard,
  AppInputField,
  AppDivider,
  AppEditCategorySubCategoryDialog,
  AppCategoryListItem,
  AppSpinner
} from "../../components";
import { useParams } from "react-router-dom";
import { windowScrollTop, sortByName } from "../../utilities";

const Category = ({
  loadCategories,
  loading,
  expenseTypeList,
  incomeTypeList
}) => {
  const { type } = useParams();
  const defaultList =
    type === "expense"
      ? expenseTypeList.sort(sortByName)
      : incomeTypeList.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );

  const [categoryList, setCategoryList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogObj, setDialogObj] = useState(false);

  useEffect(() => {
    windowScrollTop();
    setCategoryList(defaultList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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

  const toggleDialog = (flag) => setOpenDialog(flag);

  return (
    <div>
      <AppCard>
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
          loadCategories={loadCategories}
        ></AppEditCategorySubCategoryDialog>
      </AppCard>
      {loading && <AppSpinner />}
    </div>
  );
};

export default Category;
