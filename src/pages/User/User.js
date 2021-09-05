import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { AppTopNavigation } from "../../components";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Dashboard from "./Dashboard";
import { AppContext, UserContext } from "../../contexts";
import { AppApiFetch, AppConstant } from "../../utilities";
import AddExpenseIncome from "./AddExpenseIncome";
import ExpenseIncomeList from "./ExpenseIncomeList";
import Report from "./Report";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  dashboard: {
    marginTop: "4.8rem",
  },
});

export default function User() {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const { getUserObject } = useContext(AppContext);
  const { setUserData } = useContext(UserContext);
  const {
    expense: { apiPath },
  } = AppConstant;

  const getUserDataEvent = async () => {
    const { family } = getUserObject();
    const options = {
      method: "GET",
      queryParams: { family },
    };
    const response = await AppApiFetch(apiPath.read, options);
    const { status, data } = await response.json();
    if (status) {
      setUserData(data);
    }
  };

  useEffect(() => {
    getUserDataEvent();
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
            <ExpenseIncomeList
              getUserData={getUserDataEvent}
            ></ExpenseIncomeList>
          </Route>
          <Route exact path={`${path}/:type/add`}>
            <AddExpenseIncome
              getUserDataEvent={getUserDataEvent}
            ></AddExpenseIncome>
          </Route>
          <Route exact path={`${path}/:type/report`}>
            <Report></Report>
          </Route>
        </Switch>
      </div>
    </div>
  );
}
