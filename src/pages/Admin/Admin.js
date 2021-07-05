import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppTopNavigation } from "../../components";

import { Switch, Route, useRouteMatch } from "react-router-dom";
import Dashboard from "./Dashboard";
import Category from "./Category";
import AddEditCategory from "./AddEditCategory";
import { AdminContext } from "../../AdminContext";
import { useEffect } from "react";
import { AppApiFetch, AppConstant } from "../../utilities";
import { AppContext } from "../../AppContext";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  dashboard: {
    marginTop: "4.8rem",
  },
});

export default function Admin() {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const appCtx = useContext(AppContext);
  const adminCtx = useContext(AdminContext);
  const {
    admin: {
      category: { apiPath },
    },
  } = AppConstant;

  const getAdminDataEvent = async () => {
    const { family } = appCtx.getUserObject();
    const type = "category";
    const options = {
      method: "GET",
      queryParams: { family, type },
    };
    const response = await AppApiFetch(apiPath.read, options);
    const { status, data } = await response.json();
    if (status) {
      adminCtx.setAdminData(data);
    }
  };

  useEffect(() => {
    getAdminDataEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <AppTopNavigation></AppTopNavigation>
      <div className={classes.dashboard}>
        <Switch>
          <Route exact path={`${path}/dashboard`}>
            <Dashboard></Dashboard>
          </Route>
          <Route exact path={`${path}/:type`}>
            <Category></Category>
          </Route>
          <Route exact path={`${path}/:type/:page`}>
            <AddEditCategory getAdminData={getAdminDataEvent}></AddEditCategory>
          </Route>
          <Route exact path={`${path}/:type/:page/:categoryId`}>
            <AddEditCategory getAdminData={getAdminDataEvent}></AddEditCategory>
          </Route>
        </Switch>
      </div>
    </div>
  );
}
