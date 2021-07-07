import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { AppTopNavigation, AppSnackbar } from "../../components";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Dashboard from "./Dashboard";
import Category from "./Category";
import AddEditCategory from "./AddEditCategory";
import AddEditSubCategory from "./AddEditSubCategory";
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
            <Category></Category>
          </Route>
          <Route exact path={`${path}/:type/:page`}>
            <AddEditCategory
              getAdminData={getAdminDataEvent}
              showToaster={showToaster}
            ></AddEditCategory>
          </Route>
          <Route exact path={`${path}/:type/:page/:categoryId`}>
            <AddEditCategory
              getAdminData={getAdminDataEvent}
              showToaster={showToaster}
            ></AddEditCategory>
          </Route>
          <Route exact path={`${path}/:type/:page/:categoryId`}>
            <AddEditSubCategory
              getAdminData={getAdminDataEvent}
              showToaster={showToaster}
            ></AddEditSubCategory>
          </Route>
          <Route exact path={`${path}/:type/:page/:categoryId/:subCategoryId`}>
            <AddEditSubCategory
              getAdminData={getAdminDataEvent}
              showToaster={showToaster}
            ></AddEditSubCategory>
          </Route>
        </Switch>
      </div>
    </div>
  );
}
