import React, { useContext, useState, useEffect } from "react";
import { List } from "@material-ui/core";
import {
  AppCard,
  AppInputField,
  AppDivider,
  AppDialog,
  AppListItem,
} from "../../components";
import { AdminContext } from "../../AdminContext";
import { useParams } from "react-router-dom";
import { windowScrollTop } from "../../utilities";

export default function Category(props) {
  const { getAdminData, showToaster } = props;
  const { type } = useParams();
  const adminCtx = useContext(AdminContext);
  const defaultList = adminCtx[`${type}CategoryList`];
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

  const listItemClick = (isSubCategory, value) => {
    // history.push(`${type}/edit/${value.id}`);
    toggleDialog(true);
    setDialogObj({ ...value, isSubCategory });
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
            <AppListItem
              key={i}
              {...item}
              listItemClick={listItemClick}
            ></AppListItem>
          ))}
        </List>
        <AppDialog
          openDialog={openDialog}
          dialogObj={dialogObj}
          toggleDialog={toggleDialog}
          getAdminData={getAdminData}
          showToaster={showToaster}
        ></AppDialog>
      </AppCard>
    </div>
  );
}
