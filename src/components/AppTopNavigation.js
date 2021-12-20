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
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
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
  const { getUserObject, toggleDrawerStatus } = useContext(AppContext);
  const history = useHistory();
  const { username, isAdmin, family } = getUserObject();
  const [anchorEl, setAnchorEl] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (page) => {
    setAnchorEl(null);
    if (typeof page === "string") history.replace({ pathname: page });
  };

  const handleLogoutClick = (event) => {
    const { login } = AppConstant;
    AppStorage.removeItemFromStorage(login.storage);
    history.replace({ pathname: "/login" });
  };

  const handleBackClick = (event) => {
    history.goBack();
  };

  const adminMenuItem = [
    { name: "Dashboard", path: "/admin" },
    { name: "Add Expense Category", path: "/admin/expense/add" },
    { name: "Add Income Category", path: "/admin/income/add" },
    { name: "User Dashboard", path: "/user" },
    { name: "Add Expense", path: "/user/expense/add" },
    { name: "Add Income", path: "/user/income/add" },
    { name: "Expense Report", path: "/user/expense/report" },
    { name: "Income Report", path: "/user/income/report" },
  ];
  const userMenuItem = [
    { name: "User Dashboard", path: "/user/" },
    { name: "Add Expense", path: "/user/expense/add" },
    { name: "Add Income", path: "/user/income/add" },
    { name: "Expense Report", path: "/user/expense/report" },
    { name: "Income Report", path: "/user/income/report" },
  ];

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      {/* {isAdmin &&
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
        ))} */}
      <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            aria-label="back navigation"
            aria-haspopup="false"
            onClick={handleBackClick}
            color="inherit"
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            edge="start"
            aria-label="menu"
            aria-haspopup="false"
            onClick={(e) => toggleDrawerStatus(e, "toggle")}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
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
