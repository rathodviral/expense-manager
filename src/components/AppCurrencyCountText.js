import React from "react";
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
  detail: {
    textAlign: "center",
    fontSize: "0.8rem",
  },
});

export default function AppCurrencyCountText(props) {
  const classes = useStyles();
  const { count, type, onClick } = props;
  return (
    <React.Fragment>
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
      <Typography className={`${classes.detail} ${classes[type]}`}>
        (Click to check detail)
      </Typography>
    </React.Fragment>
  );
}
