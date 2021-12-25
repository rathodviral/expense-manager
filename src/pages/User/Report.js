import React, { useContext, useEffect, useState } from "react";
import {
  AppCard,
  AppButton,
  AppDateField,
  AppDivider,
  AppListItem,
  AppCurrencyCountText,
  AppFilterDialog,
} from "../../components";
import { useParams } from "react-router-dom";
import { AppApiFetch, AppConstant, AppDate } from "../../utilities";
import { Box, List } from "@material-ui/core";
import { AppContext } from "../../contexts";
import {
  isFalsyValue,
  isValueNullOrUndefined,
  sortByDate,
  getUsersOptions,
  getTotal,
} from "../../utilities/common";
import { useSelector } from "react-redux";
import {
  categoryExpenseList,
  categoryIncomeList,
} from "../../reducers/expense";

export default function Report(props) {
  const expenseCategoryList = useSelector(categoryExpenseList);
  const incomeCategoryList = useSelector(categoryIncomeList);
  const { getUserObject } = useContext(AppContext);

  const { type } = useParams();
  const isExpense = type === "expense";
  const typeList = isExpense ? expenseCategoryList : incomeCategoryList;

  const { report } = AppConstant;
  const defaultFields = { ...report.fields };
  const defaultListFields = { ...report.listFields };
  const [startDateField, setStartDateField] = useState(defaultFields.startDate);
  const [endDateField, setEndDateField] = useState(defaultFields.endDate);

  const [defaultExpenseIncomeList, setDefaultExpenseIncomeList] = useState([]);
  const [expenseIncomeList, setExpenseIncomeList] = useState([]);
  const [userList, setUserList] = useState([]);

  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  useEffect(() => {
    if (typeList.length > 0) {
      setValues(defaultFields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeList]);

  const getQueryData = () => {
    return {
      start: AppDate.getDateIntoString(startDateField.value),
      end: AppDate.getDateIntoString(endDateField.value),
      isExpense: isExpense ? "1" : "0",
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
      helperText: `Enter ${formObject.label}, it's required field`,
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
      queryParams: { family, ...queryData },
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
              categoryItem && categoryItem.name ? categoryItem.name : null,
          };
        })
        .sort(sortByDate);
      setDefaultExpenseIncomeList(mappedList);
      setExpenseIncomeList(mappedList);
      const uList = getUsersOptions(mappedList);
      setUserList(uList);
    }
  };

  const toggleFilterDialog = (flag) => {
    setOpenFilterDialog(flag);
  };

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

  return (
    <div>
      <AppCard>
        <AppCurrencyCountText
          count={getTotal(expenseIncomeList)}
          type={type}
          onClick={(e) => toggleFilterDialog(true)}
        ></AppCurrencyCountText>
        <AppDivider />
        <form noValidate autoComplete="off" onSubmit={formSubmit}>
          {/* <Box display="flex" flexDirection="row">
            <Box pr={1} width="50%">
              <AppDateField
                {...startDateField}
                minDate={AppDate.getDateFromString("2021-12-01")}
                handleChange={startDateFieldChange}
              />
            </Box>
            <Box pl={1} width="50%">
              <AppDateField
                {...endDateField}
                minDate={AppDate.getDateFromString("2021-12-01")}
                handleChange={endDateFieldChange}
              />
            </Box>
          </Box> */}
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
          title={`Filter ${type} List`}
          emitEvents={emitEvents}
          defaultList={typeList}
          userList={userList}
          defaultFields={defaultListFields}
        ></AppFilterDialog>
      </AppCard>
    </div>
  );
}
