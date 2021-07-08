import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  text: { textAlign: "center", margin: "0.5rem 0" },
  expense: {
    color: "#dc3545",
  },
  income: {
    color: "#28a745",
  },
  primary: {
    color: "#3f51b5",
  },
});

export default function AppInfoText(props) {
  const classes = useStyles();
  const { text, type = "primary" } = props;
  return (
    <Typography variant="h6" className={`${classes.text} ${classes[type]}`}>
      {text}
    </Typography>
  );
}
