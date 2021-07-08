import React, { useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { AppContext } from "../contexts";

export default function AppAlertDialog(props) {
  const {
    alertDialogObj: {
      isOpen,
      title,
      message,
      agreeBtnText,
      disagreeBtnText,
      dialogBtnClick,
    },
    hideAlertDialogObj,
  } = useContext(AppContext);
  return (
    <Dialog
      open={isOpen}
      onClose={(e) => hideAlertDialogObj(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            dialogBtnClick(false);
            hideAlertDialogObj(false);
          }}
          color="primary"
        >
          {disagreeBtnText}
        </Button>
        <Button
          onClick={(e) => {
            dialogBtnClick(true);
            hideAlertDialogObj(false);
          }}
          color="primary"
          autoFocus
        >
          {agreeBtnText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
