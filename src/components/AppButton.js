import React from "react";
import { makeStyles, Button } from "@material-ui/core";

const useStyles = makeStyles({
  button: {
    marginTop: 16,
  },
  expense: {
    backgroundColor: "#dc3545",
  },
  income: {
    backgroundColor: "#28a745",
  },
});

export default function AppButton(props) {
  const classes = useStyles();
  const { type, onClick, children } = props;
  return (
    <Button
      type="button"
      variant="contained"
      color="primary"
      className={`${classes.button} ${type ? classes[type] : ""}`}
      fullWidth
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
