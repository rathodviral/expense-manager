import React from "react";
import { makeStyles } from "@material-ui/core";
import { AppCountText, AppCard } from "../../components";
import { useContext } from "react";
import { AdminContext } from "../../AdminContext";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function Dashboard(props) {
  const { incomeCategoryList, expenseCategoryList } = useContext(AdminContext);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* <DashboardCard
        title="Expense"
        count={expenseCategoryList.length}
        color="#dc3545"
      />
      <DashboardCard
        title="Income"
        count={incomeCategoryList.length}
        color="#28a745"
      /> */}
      <AppCard title="Expense">
        <AppCountText
          count={expenseCategoryList.length}
          type="expense"
        ></AppCountText>
      </AppCard>
      <AppCard title="Income">
        <AppCountText
          count={incomeCategoryList.length}
          type="income"
        ></AppCountText>
      </AppCard>
    </div>
  );
}
