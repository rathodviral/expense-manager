// new Intl.NumberFormat('en-IN').format(number)import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  count: {
    textAlign: "center",
    cursor: "pointer",
    fontSize: "2rem",
    fontWeight: 500,
  },
  expense: {
    color: "#dc3545",
  },
  income: {
    color: "#28a745",
  },
});

export default function AppCurrencyCountText(props) {
  const classes = useStyles();
  const { count, type, onClick } = props;
  return (
    <Typography
      className={`${classes.count} ${classes[type]}`}
      variant="h3"
      onClick={onClick}
    >
      {new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(count)}
    </Typography>
  );
}
