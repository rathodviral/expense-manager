import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { AppTopNavigation } from "../../components";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Dashboard from "./Dashboard";
import Category from "./Category";
import AddCategorySubCategory from "./AddCategorySubCategory";
import { AdminContext, AppContext } from "../../contexts";
import { useEffect } from "react";
import { AppApiFetch, AppConstant } from "../../utilities";
import { useDispatch } from "react-redux";
import { fetchCategory } from "../../reducers/category";

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
  const { getUserObject } = useContext(AppContext);
  const { setAdminData } = useContext(AdminContext);
  const {
    admin: {
      category: { apiPath },
    },
  } = AppConstant;

  const dispatch = useDispatch();

  const getAdminDataEvent = async () => {
    const { family } = getUserObject();
    const type = "category";
    const options = {
      method: "GET",
      queryParams: { family, type },
    };
    const response = await AppApiFetch(apiPath.read, options);
    const { status, data } = await response.json();
    if (status) {
      setAdminData(data);
    }
  };

  useEffect(() => {
    // getAdminDataEvent();
    dispatch(fetchCategory());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <AppTopNavigation></AppTopNavigation>
      <div className={classes.dashboard}>
        <Switch>
          <Route exact path={`${path}`}>
            <Dashboard></Dashboard>
          </Route>
          <Route exact path={`${path}/:type`}>
            <Category getAdminData={getAdminDataEvent}></Category>
          </Route>
          <Route exact path={`${path}/:type/add`}>
            <AddCategorySubCategory
              getAdminData={getAdminDataEvent}
            ></AddCategorySubCategory>
          </Route>
          <Route exact path={`${path}/:type/add/:categoryId`}>
            <AddCategorySubCategory
              getAdminData={getAdminDataEvent}
            ></AddCategorySubCategory>
          </Route>
        </Switch>
      </div>
    </div>
  );
}
