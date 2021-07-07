import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { AppTopNavigation, AppSnackbar } from "../../components";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Dashboard from "./Dashboard";
import Category from "./Category";
import AddCategorySubCategory from "./AddCategorySubCategory";
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

  const defaultToasterObj = { isOpen: false, message: "" };
  const [toasterObj, setToasterObj] = useState(defaultToasterObj);

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

  const showToaster = (message) => {
    setToasterObj({ isOpen: true, message });
  };

  const handleToasterClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToasterObj(defaultToasterObj);
  };

  useEffect(() => {
    getAdminDataEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <AppTopNavigation></AppTopNavigation>
      <AppSnackbar
        {...toasterObj}
        handleToasterClose={handleToasterClose}
      ></AppSnackbar>
      <div className={classes.dashboard}>
        <Switch>
          <Route exact path={`${path}/dashboard`}>
            <Dashboard></Dashboard>
          </Route>
          <Route exact path={`${path}/:type`}>
            <Category
              getAdminData={getAdminDataEvent}
              showToaster={showToaster}
            ></Category>
          </Route>
          <Route exact path={`${path}/:type/add`}>
            <AddCategorySubCategory
              getAdminData={getAdminDataEvent}
              showToaster={showToaster}
            ></AddCategorySubCategory>
          </Route>
          <Route exact path={`${path}/:type/add/:categoryId`}>
            <AddCategorySubCategory
              getAdminData={getAdminDataEvent}
              showToaster={showToaster}
            ></AddCategorySubCategory>
          </Route>
        </Switch>
      </div>
    </div>
  );
}
