import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { AppSpinner, AppTopNavigation, AppDrawer } from "../../components";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Dashboard from "./Dashboard";
import AddExpenseIncome from "./AddExpenseIncome";
import ExpenseIncomeList from "./ExpenseIncomeList";
import Report from "./Report";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpense, showUserLoader } from "../../reducers/expense";

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

  const dispatch = useDispatch();

  // const showSpinner = useSelector(showUserLoader);

  useEffect(() => {
    dispatch(fetchExpense());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <div className={classes.root}>
        <AppTopNavigation></AppTopNavigation>
        {/* <AppDrawer /> */}
        <div className={classes.dashboard}>
          <Switch>
            <Route exact path={`${path}`}>
              <Dashboard></Dashboard>
            </Route>
            <Route exact path={`${path}/:type`}>
              <ExpenseIncomeList />
            </Route>
            <Route exact path={`${path}/:type/add`}>
              <AddExpenseIncome />
            </Route>
            <Route exact path={`${path}/:type/report`}>
              <Report />
            </Route>
          </Switch>
        </div>
      </div>
      {/* {showSpinner && <AppSpinner />} */}
    </React.Fragment>
  );
}
