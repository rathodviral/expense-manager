import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { AppSpinner, AppTopNavigation } from "../../components";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Dashboard from "./Dashboard";
import AddExpenseIncome from "./AddExpenseIncome";
import ExpenseIncomeList from "./ExpenseIncomeList";
import { connect } from "react-redux";
import {
  getExpenseTypeCategories,
  getExpenseTypeData,
  getIncomeTypeCategories,
  getIncomeTypeData,
  isExpensesLoad,
  loadExpenses
} from "../../reducers";
import Report from "../Report";

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  dashboard: {
    marginTop: "4.8rem"
  }
});

const User = (props) => {
  const classes = useStyles();
  const { path } = useRouteMatch();

  useEffect(() => {
    props.loadExpenses();
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
              <Dashboard />
            </Route>
            <Route exact path={`${path}/:type`}>
              <ExpenseIncomeList {...props} />
            </Route>
            <Route exact path={`${path}/:type/add`}>
              <AddExpenseIncome {...props} />
            </Route>
            {/* <Route exact path={`${path}/:type/report`}>
              <Report {...props} />
            </Route> */}
          </Switch>
        </div>
      </div>
      {props.loading && <AppSpinner />}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  loading: isExpensesLoad(state),
  expenseCategoryList: getExpenseTypeCategories(state),
  incomeCategoryList: getIncomeTypeCategories(state),
  expenseUserList: getExpenseTypeData(state),
  incomeUserList: getIncomeTypeData(state)
});

export default connect(mapStateToProps, { loadExpenses })(User);
