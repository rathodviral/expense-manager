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
import EditListItem from "./EditListItem";
import { AppApiFetch, AppConstant } from "../utilities";
import { AppContext } from "../contexts";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  saveButton: {
    marginLeft: "auto",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AppDialog(props) {
  const { openDialog, dialogObj, toggleDialog, getAdminData, showToaster } =
    props;
  const classes = useStyles();
  const { getUserObject, showAlertDialogObj } = useContext(AppContext);

  const alertBtnClickDeleteListItem = (isDelete) => {
    if (isDelete) {
      deleteListItem();
    }
  };
  const alertDeleteListItem = () => {
    const { isSubCategory, name } = dialogObj;
    const title = `${isSubCategory ? "Sub " : ""} Category`;
    const obj = {
      title: `Delete ${title}`,
      message: `Are you sure, you want to delete "${name}" ${title}.`,
      agreeBtnText: "Agree",
      disagreeBtnText: "Disagree",
      dialogBtnClick: alertBtnClickDeleteListItem,
    };
    showAlertDialogObj(obj);
  };

  const deleteListItem = async () => {
    const { isSubCategory, id } = dialogObj;
    const { family } = getUserObject();
    const {
      admin: { category, subCategory },
    } = AppConstant;
    const { apiPath } = isSubCategory ? subCategory : category;
    const options = {
      method: "DELETE",
      queryParams: { family, id },
    };
    const response = await AppApiFetch(apiPath.delete, options);
    const { status } = await response.json();
    if (status) {
      showToaster(`${isSubCategory ? "Sub " : ""} Category Deleted.`);
      getAdminData();
      toggleDialog(false);
    } else {
      showToaster("Some Issue");
    }
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
          <Typography variant="h6" className={classes.title}>
            {dialogObj.name}
          </Typography>
          <IconButton
            className={classes.saveButton}
            edge="start"
            color="inherit"
            onClick={(e) => alertDeleteListItem()}
            aria-label="close"
          >
            <DeleteIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <EditListItem
        {...dialogObj}
        getAdminData={getAdminData}
        showToaster={showToaster}
      ></EditListItem>
    </Dialog>
  );
}
