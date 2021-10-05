import React from "react";
import { ListItem, ListItemText, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(6),
  },
  border: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
}));

export default function AppCategoryListItem(props) {
  const classes = useStyles();
  const { name, id, detail, isExpense, listItemClick } = props;

  return (
    <React.Fragment>
      <ListItem
        className={classes.border}
        button
        onClick={(e) => listItemClick({ name, id, detail, isExpense })}
      >
        <ListItemText primary={name} />
      </ListItem>
    </React.Fragment>
  );
}
