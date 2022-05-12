import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core";
import {
  AppCurrencyCountText,
  AppCard,
  AppButton,
  AppInfoText,
  AppDivider
} from "../../components";
import { AppContext } from "../../contexts";
import { useHistory } from "react-router";
import { AppDate, getCurrencyFormat } from "../../utilities";
import { connect } from "react-redux";
import {
  getExpenseTypeDataPaidTotal,
  getExpenseTypeDataTotal,
  getIncomeTypeDataTotal,
  getIncomeTypeDataUnPaidTotal,
  isExpensesLoad
} from "../../reducers";

const useStyles = makeStyles({
  root: {
    width: "100%"
  }
});

const Dashboard = ({
  loading,
  totalIncome,
  totalExpense,
  totalPaidExpense,
  totalUnpaidExpense
}) => {
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
      text: loading
        ? "--"
        : `${getCurrencyFormat(totalIncome)} - ${getCurrencyFormat(
            totalPaidExpense
          )}`,
      textList: [
        {
          title: "Income",
          text: loading ? "--" : getCurrencyFormat(totalIncome)
        },
        {
          title: "Paid Expense",
          text: loading ? "--" : getCurrencyFormat(totalPaidExpense)
        }
      ]
    },
    {
      title: "Expense",
      type: "expense",
      count: totalExpense,
      isButtonShow: true,
      text: loading
        ? "--"
        : `${getCurrencyFormat(totalUnpaidExpense)} + ${getCurrencyFormat(
            totalPaidExpense
          )}`,
      textList: [
        {
          title: "Unpaid",
          text: loading ? "--" : getCurrencyFormat(totalUnpaidExpense)
        },
        {
          title: "Paid",
          text: loading ? "--" : getCurrencyFormat(totalPaidExpense)
        }
      ]
    }
  ];

  if (isAdmin) {
    cardList[2] = {
      title: "Income",
      type: "income",
      count: totalIncome,
      isButtonShow: true
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
            if (count > 0) history.push(`./user/${type}`);
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
};

const mapStateToProps = (state) => ({
  loading: isExpensesLoad(state),
  totalExpense: getExpenseTypeDataTotal(state),
  totalIncome: getIncomeTypeDataTotal(state),
  totalUnpaidExpense: getExpenseTypeDataPaidTotal(state),
  totalPaidExpense: getIncomeTypeDataUnPaidTotal(state)
});

export default connect(mapStateToProps)(Dashboard);
