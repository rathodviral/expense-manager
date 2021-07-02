import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppTopNavigation } from "../../components";

import { Switch, Route, useRouteMatch } from "react-router-dom";
import Dashboard from "./Dashboard";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function Admin() {
  const classes = useStyles();
  const { path } = useRouteMatch();

  return (
    <div className={classes.root}>
      <AppTopNavigation></AppTopNavigation>
      <Switch>
        <Route exact path={`${path}/dashboard`}>
          <Dashboard></Dashboard>
        </Route>
      </Switch>
    </div>
  );
}
