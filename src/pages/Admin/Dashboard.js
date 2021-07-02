import React from "react";
import { makeStyles, Card, CardContent, Typography } from "@material-ui/core";
import { AppDivider } from "../../components";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function Dashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card className={classes.card} variant="outlined">
        <CardContent>
          <Typography className={classes.title}>Expense Manager</Typography>
          <AppDivider />
        </CardContent>
      </Card>
    </div>
  );
}
