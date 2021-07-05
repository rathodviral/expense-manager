import React, { useContext, useState } from "react";
import {
  makeStyles,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import { AppCard, AppInputField, AppDivider } from "../../components";
import { AdminContext } from "../../AdminContext";
import { useHistory, useParams } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function Category(params) {
  const classes = useStyles();
  let { type } = useParams();
  const history = useHistory();
  const adminCtx = useContext(AdminContext);
  const defaultList = adminCtx[`${type}CategoryList`] || [];
  const [categoryList, setCategoryList] = useState(defaultList);
  const [searchText, setSearchText] = useState("");

  const handleChange = (value) => {
    setSearchText(value);
    const list =
      value !== ""
        ? defaultList.filter((x) => x.name.toLowerCase().includes(value))
        : [...defaultList];
    setCategoryList(list);
  };

  const listItemClick = (value) => {
    history.push(`${type}/edit/${value.id}`);
  };

  const AppListItem = (props) => {
    const {
      data: { name, subCategoryList },
    } = props;

    return (
      <ListItem button onClick={(e) => listItemClick(props.data)}>
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={name}
          secondary={`Sub Categories (${subCategoryList.length})`}
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  return (
    <div>
      <AppCard title={`${type} Categories`}>
        <List className={classes.root}>
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
          {categoryList.map((item, i) => (
            <AppListItem key={i} data={item}></AppListItem>
          ))}
        </List>
      </AppCard>
    </div>
  );
}
