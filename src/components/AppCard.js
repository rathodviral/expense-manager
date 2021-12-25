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
    fontWeight: 400,
    textAlign: "center",
    textTransform: "capitalize",
  },
});

export default function AppCard(props) {
  const { title = null, children } = props;
  const classes = useStyles();

  return (
    <Card className={classes.card} variant="outlined">
      <CardContent>
        {title && <Typography className={classes.title}>{title}</Typography>}
        {title && <AppDivider />}
        {children}
      </CardContent>
    </Card>
  );
}
