import React from "react";
import { Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

export default function AppSnackbar(props) {
  const { isOpen, message, hideDuration = 6000, handleToasterClose } = props;
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={isOpen}
      autoHideDuration={hideDuration}
      onClose={handleToasterClose}
      message={message}
      key={new Date().getTime()}
      action={
        <React.Fragment>
          <IconButton
            aria-label="close"
            color="inherit"
            onClick={handleToasterClose}
          >
            <CloseIcon />
          </IconButton>
        </React.Fragment>
      }
    />
  );
}
