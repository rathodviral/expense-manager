import React from "react";
import {
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
  Chip,
} from "@material-ui/core";
import { AppDate } from "../utilities";

const useStyles = makeStyles((theme) => ({
  noPadding: {
    paddingLeft: 0,
    paddingRight: 0,
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  displayFlex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chipPosition: {
    position: "relative",
    top: "-2px",
    left: "5px",
  },
  dateFontSize: {
    fontSize: "0.875rem",
    margin: 0,
  },
  categoryFontStyle: {
    fontSize: "1.2rem",
    margin: 0,
    textTransform: "capitalize",
  },
}));

export default function AppListItem(props) {
  const classes = useStyles();
  const {
    amount,
    date,
    isPaid,
    categoryName,
    user,
    subCategoryName,
    listItemClick,
    note,
    id,
    isExpense,
  } = props;

  return (
    <ListItem
      className={classes.noPadding}
      button
      onClick={(e) => listItemClick(id)}
    >
      {/* <ListItemIcon>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            listItemClick(false, { id, category, detail });
          }}
        >
          <EditIcon />
        </IconButton>
      </ListItemIcon> */}
      <ListItemText
        primary={
          <div>
            <div className={classes.displayFlex}>
              <Typography variant="h6">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(amount)}
                {isExpense && (
                  <Chip
                    className={classes.chipPosition}
                    label={isPaid ? "Paid" : "Not Paid"}
                    color={isPaid ? "primary" : "secondary"}
                    size="small"
                  />
                )}
              </Typography>
              <p className={classes.dateFontSize}>
                {AppDate.getDateIntoString(date, "MMM, Do YYYY")}
              </p>
            </div>
            <div className={classes.displayFlex}>
              <p className={classes.categoryFontStyle}>
                <b>{categoryName}</b>
              </p>
            </div>
            <div className={classes.displayFlex}>
              <p className={classes.dateFontSize}>
                <b>Added By : </b> {user}
              </p>
            </div>
            {note && (
              <div className={classes.displayFlex}>
                <p className={classes.dateFontSize}>
                  <b>Details : </b> {note}
                </p>
              </div>
            )}
          </div>
        }
      />
    </ListItem>
  );
}
