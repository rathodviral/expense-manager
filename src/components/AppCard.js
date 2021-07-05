import React from "react";
import { makeStyles, Card, CardContent, Typography } from "@material-ui/core";
import AppDivider from "./AppDivider";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  card: {
    // height: "calc(100vh - 60px)",
    marginTop: "1rem",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 500,
    textAlign: "center",
    textTransform: "capitalize",
  },
});

export default function AppCard(props) {
  const { title = "", children } = props;
  const classes = useStyles();

  return (
    <Card className={classes.card} variant="outlined">
      <CardContent>
        <Typography className={classes.title}>{title}</Typography>
        <AppDivider />
        {children}
      </CardContent>
    </Card>
  );
}
