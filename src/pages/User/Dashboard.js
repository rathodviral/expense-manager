import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core";
import {
  AppCurrencyCountText,
  AppCard,
  AppButton,
  AppInfoText,
} from "../../components";
import { UserContext } from "../../contexts";
import { useHistory } from "react-router";
import { AppDate, getCurrencyFormat } from "../../utilities";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function Dashboard(props) {
  const { totalIncome, totalExpense, totalPaidExpense, totalUnpaidExpense } =
    useContext(UserContext);
  const classes = useStyles();
  const history = useHistory();
  const { getMonth } = AppDate;
  const cardList = [
    {
      title: `Balance of ${getMonth}`,
      type: totalIncome - totalPaidExpense > 0 ? "income" : "expense",
      count: totalIncome - totalPaidExpense,
      isButtonShow: false,
      text: `${getCurrencyFormat(totalIncome)} - ${getCurrencyFormat(
        totalPaidExpense
      )}`,
    },
    {
      title: "Expense",
      type: "expense",
      count: totalExpense,
      isButtonShow: true,
      text: `${getCurrencyFormat(totalUnpaidExpense)} + ${getCurrencyFormat(
        totalPaidExpense
      )}`,
    },
    {
      title: "Income",
      type: "income",
      count: totalIncome,
      isButtonShow: true,
    },
  ];

  const Card = (props) => {
    const { title, type, count, isButtonShow, text } = props;
    return (
      <AppCard title={title}>
        {text && <AppInfoText text={text} type={type}></AppInfoText>}
        <AppCurrencyCountText
          count={count}
          type={type}
          onClick={(e) => {
            history.push(type);
          }}
        ></AppCurrencyCountText>
        {isButtonShow && (
          <AppButton
            onClick={(e) => {
              history.push(`${type}/add`);
            }}
            type={type}
          >
            Add {title}
          </AppButton>
        )}
      </AppCard>
    );
  };

  return (
    <div className={classes.root}>
      {cardList.map((card, i) => (
        <Card key={i} {...card} />
      ))}
    </div>
  );
}
