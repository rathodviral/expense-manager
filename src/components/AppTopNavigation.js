import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { AppConstant, AppStorage } from "../utilities";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function AppTopNavigation() {
  const classes = useStyles();
  const { login } = AppConstant;
  const appStorage = AppStorage();

  const { username } = appStorage.getItemFromStorage(login.storage);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {username}
          </Typography>
          {username && <Button color="inherit">Logout</Button>}
        </Toolbar>
      </AppBar>
    </div>
  );
}
