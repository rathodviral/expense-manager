import React, { useState, useContext } from "react";
import {
  makeStyles,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { AppContext } from "../contexts";
import { AppConstant, AppStorage } from "../utilities";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textTransform: "capitalize",
  },
}));

export default function AppTopNavigation() {
  const classes = useStyles();
  const { getUserObject } = useContext(AppContext);
  const history = useHistory();
  const { username, isAdmin, family } = getUserObject();
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

  const adminMenuItem = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "User Dashboard", path: "/user/dashboard" },
    { name: "Add Expense Category", path: "/admin/expense/add" },
    { name: "Add Income Category", path: "/admin/income/add" },
  ];
  const userMenuItem = [{ name: "User Dashboard", path: "/user/dashboard" }];

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      {isAdmin &&
        adminMenuItem.map((item, i) => (
          <MenuItem key={i} onClick={(e) => handleMenuClose(item.path)}>
            {item.name}
          </MenuItem>
        ))}
      {!isAdmin &&
        userMenuItem.map((item, i) => (
          <MenuItem key={i} onClick={(e) => handleMenuClose(item.path)}>
            {item.name}
          </MenuItem>
        ))}
      <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {username} {family}
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
