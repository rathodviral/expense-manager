import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, 0.12)",
    margin: "0.5rem 0",
    height: 1,
  },
});

export default function AppDivider(props) {
  const classes = useStyles();
  return <div className={classes.root}></div>;
}
