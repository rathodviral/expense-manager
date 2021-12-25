import React, { useState, useEffect } from "react";
import {
  makeStyles,
  IconButton,
  Typography,
  Slide,
  Dialog,
  AppBar,
  Toolbar,
  Box,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import AppDateField from "./AppDateField";
import AppAutocompleteField from "./AppAutocompleteField";
import AppButton from "./AppButton";
import {
  AppConstant,
  AppDate,
  AppStorage,
  createOptions,
  isFalsyValue,
} from "../utilities";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  saveButton: {
    marginLeft: "auto",
  },
  title: {
    textTransform: "capitalize",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AppFilterDialog(props) {
  const {
    openDialog,
    toggleDialog,
    title,
    emitEvents,
    defaultList,
    userList,
    defaultFields,
  } = props;
  const classes = useStyles();

  const [paidField, setPaidField] = useState(true);
  const [dateField, setDateField] = useState(null);
  const [categoryField, setCategoryField] = useState(defaultFields.category);
  const [userField, setUserField] = useState(null);

  useEffect(() => {
    if (defaultFields && defaultList.length > 0) {
      setValues(defaultFields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultList, userList]);

  const getFormData = () => {
    return {
      date:
        dateField && dateField.value
          ? AppDate.getDateIntoString(dateField.value)
          : null,
      category:
        categoryField.value && categoryField.value.id
          ? categoryField.value.id
          : null,
      user: userField.value && userField.value.id ? userField.value.id : null,
      isPaid:
        paidField.value && !isFalsyValue(paidField.value.id)
          ? paidField.value.id
          : null,
    };
  };

  const setValues = ({ date, category, detail, amount, user, isPaid }) => {
    const storage = AppStorage.getItemFromStorage(AppConstant.expense.storage);
    const categoryList = defaultList.map(createOptions);
    const categoryItem =
      storage && storage.category
        ? categoryList.find((x) => x.id === storage.category)
        : null;
    const cField = {
      ...category,
      options: categoryList,
      value: categoryItem,
    };
    if (date) {
      if (storage && storage.date)
        date.value = AppDate.getDateFromString(storage.date);
      setDateField(date);
    }
    setCategoryField(cField);
    const userItem =
      storage && storage.user
        ? userList.find((x) => x.name === storage.user)
        : null;
    setUserField({ ...user, options: userList, value: userItem });
    setPaidField({
      ...isPaid,
      value: storage && storage.isPaid ? { id: true, name: "Paid" } : null,
    });
  };

  const dateFieldChange = (value, name) => {
    const field = { ...dateField, value };
    setDateField(field);
  };

  const categoryFieldChange = (value, name) => {
    const field = { ...categoryField, value };
    setCategoryField(field);
  };

  const paidFieldChange = (value, name) => {
    const field = { ...paidField, value };
    setPaidField(field);
  };

  const userFieldChange = (value, name) => {
    const field = { ...userField, value };
    setUserField(field);
  };

  const resetEvent = () => {
    AppStorage.removeItemFromStorage(AppConstant.expense.storage);
    setValues(defaultFields);
    emitEvents("reset");
  };

  const filterEvent = () => {
    const formData = getFormData();
    AppStorage.setItemInStorage(AppConstant.expense.storage, formData);
    emitEvents(formData);
  };

  return (
    <Dialog
      fullScreen
      open={openDialog}
      onClose={(e) => toggleDialog(false)}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={(e) => toggleDialog(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} noWrap={true}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ padding: "1rem" }}>
        <form noValidate autoComplete="off">
          {defaultFields && defaultFields.date && (
            <AppDateField
              {...dateField}
              minDate={AppDate.getLast3MonthsDates}
              handleChange={dateFieldChange}
            />
          )}
          <AppAutocompleteField
            {...categoryField}
            handleChange={categoryFieldChange}
          />
          <AppAutocompleteField {...userField} handleChange={userFieldChange} />
          <AppAutocompleteField {...paidField} handleChange={paidFieldChange} />
        </form>
        <Box display="flex" flexDirection="row">
          <Box pr={1} width="50%">
            <AppButton onClick={filterEvent}>Filter</AppButton>
          </Box>
          <Box pl={1} width="50%">
            <AppButton onClick={resetEvent}>Reset</AppButton>
          </Box>
        </Box>
      </div>
    </Dialog>
  );
}
