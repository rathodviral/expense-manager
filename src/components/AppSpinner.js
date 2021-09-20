import * as React from "react";
import { Box, CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  spinnerBg: {
    position: "fixed",
    width: "100%",
    height: "100%",
    "z-index": 2,
    top: 0,
    left: 0,
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
    background: "rgb(0 0 0 / 8%)",
  },
});

export default function AppSpinner() {
  const classes = useStyles();
  return (
    <Box className={classes.spinnerBg}>
      <CircularProgress />
    </Box>
  );
}
