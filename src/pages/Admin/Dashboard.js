import React from "react";
import { makeStyles } from "@material-ui/core";
import { AppCountText, AppCard, AppButton } from "../../components";
import { useContext } from "react";
import { AdminContext } from "../../AdminContext";
import { useHistory } from "react-router";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function Dashboard(props) {
  const { incomeCategoryList, expenseCategoryList } = useContext(AdminContext);
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
            history.push(type);
          }}
        ></AppCountText>
        <AppButton
          onClick={(e) => {
            history.push(`${type}/add`);
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
