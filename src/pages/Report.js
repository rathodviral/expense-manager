import React, { useContext, useEffect, useState } from "react";
import {
  AppCard,
  AppButton,
  AppDateField,
  AppDivider,
  AppListItem,
  AppCurrencyCountText,
  AppFilterDialog,
  AppInfoText,
  AppTopNavigation,
  AppSpinner
} from "../components";
import { AppApiFetch, AppConstant, AppDate } from "../utilities";
import { List, makeStyles } from "@material-ui/core";
import { AppContext } from "../contexts";
import {
  isFalsyValue,
  isValueNullOrUndefined,
  sortByDate,
  getUsersOptions,
  getTotal
} from "../utilities/common";
import { connect } from "react-redux";
import {
  getExpenseTypeCategories,
  getIncomeTypeCategories,
  isCategoriesLoad,
  loadCategories
} from "../reducers";

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  dashboard: {
    marginTop: "4.8rem"
  }
});

const Report = ({ loading, expenseTypeList, incomeTypeList }) => {
  const classes = useStyles();
  const { getUserObject } = useContext(AppContext);

  const { report } = AppConstant;
  const defaultFields = { ...report.fields };
  const defaultListFields = { ...report.listFields };
  const [startDateField, setStartDateField] = useState(defaultFields.startDate);
  const [endDateField, setEndDateField] = useState(defaultFields.endDate);

  const [typeList, setTypeList] = useState([]);
  const [defaultExpenseIncomeList, setDefaultExpenseIncomeList] = useState([]);
  const [expenseIncomeList, setExpenseIncomeList] = useState([]);
  const [userList, setUserList] = useState([]);

  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  useEffect(() => {
    if (!loading) {
      setTypeList([...expenseTypeList, ...incomeTypeList]);
      setValues(defaultFields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getQueryData = () => {
    return {
      start: AppDate.getDateIntoString(startDateField.value),
      end: AppDate.getDateIntoString(endDateField.value)
    };
  };

  const setValues = ({ startDate, endDate }) => {
    setStartDateField(startDate);
    setEndDateField(endDate);
    formSubmit();
  };

  const startDateFieldChange = (value, name) => {
    const field = { ...startDateField, value };
    setStartDateField(field);
  };

  const endDateFieldChange = (value, name) => {
    const field = { ...endDateField, value };
    setEndDateField(field);
  };

  const validateObject = (formObject, defaultFields) => {
    return {
      ...formObject,
      isError: true,
      label: "Error",
      helperText: `Enter ${formObject.label}, it's required field`
    };
  };

  const formSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isFalsyValue(startDateField.value)) {
      const field = validateObject(startDateField);
      setStartDateField(field);
      return;
    }
    if (isFalsyValue(endDateField.value)) {
      const field = validateObject(endDateField);
      setEndDateField(field);
      return;
    }
    const { family } = getUserObject();
    const { read } = report.apiPath;
    const queryData = getQueryData();
    const options = {
      method: "GET",
      queryParams: { family, ...queryData }
    };
    const response = await AppApiFetch(read, options);
    const { status, data } = await response.json();
    if (status) {
      const mappedList = data
        .map((item) => {
          const { category } = item;
          const categoryItem = typeList.find((x) => x.id === category);
          return {
            ...item,
            categoryName:
              categoryItem && categoryItem.name ? categoryItem.name : null
          };
        })
        .sort(sortByDate);
      setDefaultExpenseIncomeList(mappedList);
      setExpenseIncomeList(mappedList);
      const uList = getUsersOptions(mappedList);
      setUserList(uList);
    }
  };

  const toggleFilterDialog = (flag) => setOpenFilterDialog(flag);

  const emitEvents = (obj) => {
    toggleFilterDialog(false);
    if (obj === "reset") {
      setValues(defaultFields);
    } else {
      let list = [...defaultExpenseIncomeList];
      Object.keys(obj).forEach((x) => {
        const val = obj[x];
        if (isValueNullOrUndefined(val)) {
          list = list.filter((y) => y[x] === val);
        }
      });
      setExpenseIncomeList(list);
    }
  };

  const totalIncome = () => {
    const d = expenseIncomeList.filter((x) => !x.isExpense);
    return d.length > 0 ? getTotal(d) : 0;
  };

  const totalPaidExpense = () => {
    const d = expenseIncomeList.filter((x) => x.isExpense && x.isPaid);
    return d.length > 0 ? getTotal(d) : 0;
  };

  const count = () => totalIncome() - totalPaidExpense();

  const type = () => (count() > 0 ? "income" : "expense");

  return (
    <React.Fragment>
      <div className={classes.root}>
        <AppTopNavigation />
        {/* <AppDrawer /> */}
        <div className={classes.dashboard}>
          <AppCard>
            <AppInfoText
              text={`Total ${count() > 0 ? "Remains" : "Expense"}`}
              type={type()}
              textList={count()}
            ></AppInfoText>
            <AppDivider />
            <AppCurrencyCountText
              count={getTotal(expenseIncomeList)}
              type={type()}
              onClick={(e) => toggleFilterDialog(true)}
            ></AppCurrencyCountText>
            <AppDivider />
            <form noValidate autoComplete="off" onSubmit={formSubmit}>
              <AppDateField
                {...startDateField}
                minDate={AppDate.getDateFromString("2021-12-01")}
                handleChange={startDateFieldChange}
              />
              <AppDateField
                {...endDateField}
                minDate={AppDate.getDateFromString("2021-12-01")}
                handleChange={endDateFieldChange}
              />
              <AppButton>Search</AppButton>
            </form>
            <AppDivider />
            <List component="div" disablePadding>
              {expenseIncomeList.map((item, i) => (
                <AppListItem
                  key={i}
                  {...item}
                  listItemClick={(e) => {}}
                ></AppListItem>
              ))}
            </List>
            <AppFilterDialog
              openDialog={openFilterDialog}
              toggleDialog={toggleFilterDialog}
              title={`Filter ${type()} List`}
              emitEvents={emitEvents}
              defaultList={typeList}
              userList={userList}
              defaultFields={defaultListFields}
            ></AppFilterDialog>
          </AppCard>
        </div>
      </div>
      {loading && <AppSpinner />}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  loading: isCategoriesLoad(state),
  expenseTypeList: getExpenseTypeCategories(state),
  incomeTypeList: getIncomeTypeCategories(state)
});

export default connect(mapStateToProps, { loadCategories })(Report);
