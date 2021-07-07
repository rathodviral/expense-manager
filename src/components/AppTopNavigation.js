import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Menu, MenuItem } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/Button";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { useContext } from "react";
import { AppContext } from "../AppContext";
import { AppConstant, AppStorage } from "../utilities";
import { useHistory } from "react-router";

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
  const appCtx = useContext(AppContext);
  const history = useHistory();
  const { username } = appCtx.getUserObject();
  const [anchorEl, setAnchorEl] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (page) => {
    setAnchorEl(null);
    history.replace({ pathname: page });
  };

  const handleLogoutClick = (event) => {
    const { login } = AppConstant;
    AppStorage.removeItemFromStorage(login.storage);
    history.replace({ pathname: "/login" });
  };

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={(e) => handleMenuClose("/admin/dashboard")}>
        Dashboard
      </MenuItem>
      <MenuItem onClick={(e) => handleMenuClose("/admin/expense/add")}>
        Add Expense Category
      </MenuItem>
      <MenuItem onClick={(e) => handleMenuClose("/admin/income/add")}>
        Add Income Category
      </MenuItem>
      <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {username}
          </Typography>
          {username && (
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleMenuClick}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}
