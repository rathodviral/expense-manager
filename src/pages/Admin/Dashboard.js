import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { AppCountText, AppCard, AppButton } from "../../components";
import { AdminContext } from "../../contexts";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { expenseList, incomeList } from "../../reducers/category";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function Dashboard(props) {
  // const { incomeCategoryList, expenseCategoryList } = useContext(AdminContext);
  const expenseCategoryList = useSelector(expenseList);
  const incomeCategoryList = useSelector(incomeList);
  const classes = useStyles();
  const history = useHistory();
  const cardList = [
    { title: "Expense", type: "expense", count: expenseCategoryList.length },
    { title: "Income", type: "income", count: incomeCategoryList.length },
  ];

  const Card = (props) => {
    const { title, type, count } = props;
    return (
      <AppCard title={title}>
        <AppCountText
          count={count}
          type={type}
          onClick={(e) => {
            history.push(`/admin/${type}`);
          }}
        ></AppCountText>
        <AppButton
          onClick={(e) => {
            history.push(`/admin/${type}/add`);
          }}
          type={type}
        >
          Add {title} Category
        </AppButton>
      </AppCard>
    );
  };

  return (
    <div className={classes.root}>
      {cardList.map((card, i) => (
        <Card key={i} title={card.title} type={card.type} count={card.count} />
      ))}
    </div>
  );
}
