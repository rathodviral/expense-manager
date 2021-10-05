import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core";
import {
  AppCurrencyCountText,
  AppCard,
  AppButton,
  AppInfoText,
  AppDivider,
} from "../../components";
import { AppContext } from "../../contexts";
import { useHistory } from "react-router";
import { AppDate, getCurrencyFormat } from "../../utilities";
import { useSelector } from "react-redux";
import {
  userExpensePaidTotal,
  userExpenseTotal,
  userExpenseUnPaidTotal,
  userIncomeTotal,
} from "../../reducers/expense";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function Dashboard(props) {
  const totalIncome = useSelector(userIncomeTotal);
  const totalExpense = useSelector(userExpenseTotal);
  const totalPaidExpense = useSelector(userExpensePaidTotal);
  const totalUnpaidExpense = useSelector(userExpenseUnPaidTotal);
  const classes = useStyles();
  const { getUserObject } = useContext(AppContext);
  const history = useHistory();
  const { isAdmin } = getUserObject();
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
      textList: [
        { title: "Income", text: getCurrencyFormat(totalIncome) },
        { title: "Paid Expense", text: getCurrencyFormat(totalPaidExpense) },
      ],
    },
    {
      title: "Expense",
      type: "expense",
      count: totalExpense,
      isButtonShow: true,
      text: `${getCurrencyFormat(totalUnpaidExpense)} + ${getCurrencyFormat(
        totalPaidExpense
      )}`,
      textList: [
        {
          title: "Unpaid",
          text: getCurrencyFormat(totalUnpaidExpense),
        },
        { title: "Paid", text: getCurrencyFormat(totalPaidExpense) },
      ],
    },
  ];

  if (isAdmin) {
    cardList[2] = {
      title: "Income",
      type: "income",
      count: totalIncome,
      isButtonShow: true,
    };
  }

  const Card = (props) => {
    const { title, type, count, isButtonShow, text, textList } = props;
    return (
      <AppCard title={title}>
        {text && (
          <AppInfoText
            text={text}
            type={type}
            textList={textList}
          ></AppInfoText>
        )}
        {text && <AppDivider />}
        <AppCurrencyCountText
          count={count}
          type={type}
          onClick={(e) => {
            history.push(`./user/${type}`);
          }}
        ></AppCurrencyCountText>
        {isButtonShow && (
          <AppButton
            onClick={(e) => {
              history.push(`./user/${type}/add`);
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
