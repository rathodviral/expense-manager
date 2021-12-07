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
import { AppContext, UserContext } from "../../contexts";
import {
  isFalsyValue,
  isValueNullOrUndefined,
  sortByDate,
  getUsersOptions,
  getTotal,
} from "../../utilities/common";

export default function Report(props) {
  const { showSpinner } = props;
  const { getUserObject } = useContext(AppContext);
  const { incomeCategoryList, expenseCategoryList } = useContext(UserContext);

  const { type = "expense" } = useParams();
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

  const formSubmit = async () => {
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
    showSpinner(true);
    const response = await AppApiFetch(read, options);
    const { status, data } = await response.json();
    if (status) {
      showSpinner(false);
      const mappedList = data
        .map((item) => {
          const { category, detail } = item;
          console.log(item);
          const categoryItem = typeList.find((x) => x.id === category);
          const subCategoryItem = categoryItem.subCategoryList.find(
            (x) => x.id === detail
          );
          return {
            ...item,
            categoryName: categoryItem.name,
            subCategoryName: subCategoryItem.name,
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
      <AppCard title={`Report of ${type}`}>
        <AppCurrencyCountText
          count={getTotal(expenseIncomeList)}
          type={type}
          onClick={(e) => toggleFilterDialog(true)}
        ></AppCurrencyCountText>
        <AppDivider />
        <form noValidate autoComplete="off">
          {/* <Box display="flex" flexDirection="row">
            <Box pr={1} width="50%">
              <AppDateField
                {...startDateField}
                minDate={AppDate.getPreviousThreeMonth}
                handleChange={startDateFieldChange}
              />
            </Box>
            <Box pl={1} width="50%">
              <AppDateField
                {...endDateField}
                minDate={AppDate.getPreviousThreeMonth}
                handleChange={endDateFieldChange}
              />
            </Box>
          </Box> */}
          <AppDateField
            {...startDateField}
            minDate={AppDate.getDateFromString("2021-02-01")}
            maxDate={AppDate.getDateFromString("2021-11-30")}
            handleChange={startDateFieldChange}
          />
          <AppDateField
            {...endDateField}
            minDate={AppDate.getDateFromString("2021-02-01")}
            maxDate={AppDate.getDateFromString("2021-11-30")}
            handleChange={endDateFieldChange}
          />
          <AppButton onClick={formSubmit}>Search</AppButton>
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
