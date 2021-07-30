import React, { useContext } from "react";
import {
  makeStyles,
  IconButton,
  Typography,
  Slide,
  Dialog,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import AppDateField from "./AppDateField";
import AppSelectField from "./AppSelectField";
import AppInputField from "./AppInputField";
import AppButton from "./AppButton";
import { AppContext, UserContext } from "../contexts";

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
    formFields,
    title,
    handleChange,
    emitEvents,
    isFilter = true,
    editObj = null,
  } = props;

  const classes = useStyles();

  const { showAlertDialogObj } = useContext(AppContext);

  const alertBtnClickDeleteListItem = (isDelete) => {
    if (isDelete) {
      emitEvents("delete");
    }
  };

  const alertDeleteListItem = () => {
    const obj = {
      title: `Delete ${title}`,
      message: `Are you sure, you want to delete ${title}.`,
      agreeBtnText: "Agree",
      disagreeBtnText: "Disagree",
      dialogBtnClick: alertBtnClickDeleteListItem,
    };
    showAlertDialogObj(obj);
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
          {!isFilter && (
            <IconButton
              className={classes.saveButton}
              edge="start"
              color="inherit"
              onClick={(e) => alertDeleteListItem()}
              aria-label="close"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <div style={{ padding: "1rem" }}>
        <form noValidate autoComplete="off">
          {formFields &&
            formFields.map((field, i) => {
              if (field.type === "date") {
                return (
                  <AppDateField
                    {...field}
                    key={i}
                    handleChange={handleChange}
                  />
                );
              } else if (field.type === "select") {
                return (
                  <AppSelectField
                    {...field}
                    key={i}
                    handleChange={handleChange}
                  />
                );
              } else {
                return (
                  <AppInputField
                    {...field}
                    key={i}
                    handleChange={handleChange}
                  />
                );
              }
            })}
        </form>
        {isFilter && (
          <div>
            <AppButton onClick={() => emitEvents("filter")}>Filter</AppButton>
            <AppButton onClick={() => emitEvents("reset")}>Reset</AppButton>
          </div>
        )}
      </div>
    </Dialog>
  );
}
