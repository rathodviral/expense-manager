import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  count: {
    textAlign: "center",
  },
  expense: {
    color: "#dc3545",
  },
  income: {
    color: "#28a745",
  },
});

export default function AppCountText(props) {
  const classes = useStyles();
  const { count, type } = props;
  return (
    <Typography className={`${classes.count} ${classes[type]}`} variant="h3">
      {count}
    </Typography>
  );
}
