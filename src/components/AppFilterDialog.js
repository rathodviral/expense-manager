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
import { AppDate, createOptions, isFalsyValue } from "../utilities";

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
  const [detailField, setDetailField] = useState(defaultFields.detail);
  const [userField, setUserField] = useState(null);

  useEffect(() => {
    if (defaultList.length > 0) {
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
      detail:
        detailField.value && detailField.value.id ? detailField.value.id : null,
      user: userField.value && userField.value.id ? userField.value.id : null,
      isPaid:
        paidField.value && !isFalsyValue(paidField.value.id)
          ? paidField.value.id
          : null,
    };
  };

  const setValues = ({ date, category, detail, amount, user, isPaid }) => {
    const categoryList = defaultList.map(createOptions);
    const cField = {
      ...category,
      options: categoryList,
    };
    setDetailField(detail);
    setDateField(date);
    setCategoryField(cField);
    setUserField({ ...user, options: userList });
    setPaidField(isPaid);
  };

  const setSubCategoryOptions = (categoryId) => {
    const { subCategoryList } = categoryId
      ? defaultList.find((x) => x.id === categoryId)
      : {
          subCategoryList: [],
        };
    const subCatList = subCategoryList.map(createOptions);
    const sField = {
      ...detailField,
      options: subCatList,
      value: null,
    };
    setDetailField(sField);
  };

  const dateFieldChange = (value, name) => {
    const field = { ...dateField, value };
    setDateField(field);
  };

  const categoryFieldChange = (value, name) => {
    const field = { ...categoryField, value };
    setCategoryField(field);
    setSubCategoryOptions(value && value.id ? value.id : null);
  };

  const subCategoryFieldChange = (value, name) => {
    const field = { ...detailField, value };
    setDetailField(field);
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
    setValues(defaultFields);
    emitEvents("reset");
  };

  const filterEvent = () => {
    const formData = getFormData();
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
          <AppAutocompleteField
            {...detailField}
            handleChange={subCategoryFieldChange}
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
