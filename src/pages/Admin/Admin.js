import React from "react";
import { makeStyles } from "@material-ui/core";
import { AppTopNavigation } from "../../components";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Dashboard from "./Dashboard";
import Category from "./Category";
import AddCategorySubCategory from "./AddCategorySubCategory";
import { useEffect } from "react";
import { connect } from "react-redux";
import {
  isCategoriesLoad,
  loadCategories,
  getExpenseTypeCategories,
  getIncomeTypeCategories
} from "../../reducers";

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  dashboard: {
    marginTop: "4.8rem"
  }
});

const Admin = (props) => {
  const classes = useStyles();
  const { path } = useRouteMatch();

  useEffect(() => {
    props.loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <AppTopNavigation></AppTopNavigation>
      <div className={classes.dashboard}>
        <Switch>
          <Route exact path={`${path}`}>
            <Dashboard {...props} />
          </Route>
          <Route exact path={`${path}/:type`}>
            <Category {...props} />
          </Route>
          <Route exact path={`${path}/:type/add`}>
            <AddCategorySubCategory {...props} />
          </Route>
          <Route exact path={`${path}/:type/add/:categoryId`}>
            <AddCategorySubCategory {...props} />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: isCategoriesLoad(state),
  expenseTypeList: getExpenseTypeCategories(state),
  incomeTypeList: getIncomeTypeCategories(state)
});

export default connect(mapStateToProps, { loadCategories })(Admin);
