import React from "react";
import { makeStyles } from "@material-ui/core";
import { AppCountText, AppCard, AppButton } from "../../components";
import { useHistory } from "react-router";

const useStyles = makeStyles({
  root: {
    width: "100%"
  }
});

const Dashboard = ({ loading, expenseTypeList, incomeTypeList }) => {
  const classes = useStyles();
  const history = useHistory();
  const cardList = [
    {
      title: "Expense",
      type: "expense",
      count: loading ? "--" : expenseTypeList.length
    },
    {
      title: "Income",
      type: "income",
      count: loading ? "--" : incomeTypeList.length
    }
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
};

export default Dashboard;
