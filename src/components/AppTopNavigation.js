import React, { useState, useContext } from "react";
import {
  makeStyles,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
  Typography
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import { AppContext } from "../contexts";
import { AppConstant, AppStorage } from "../utilities";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1,
    textTransform: "capitalize"
  }
}));

export default function AppTopNavigation() {
  const classes = useStyles();
  const { getUserObject } = useContext(AppContext);
  const history = useHistory();
  const { username, isAdmin } = getUserObject();
  const [anchorEl, setAnchorEl] = useState(false);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);

  const handleMenuClose = (page) => {
    setAnchorEl(null);
    if (typeof page === "string") history.push({ pathname: page });
  };

  const handleLogoutClick = (event) => {
    const { login } = AppConstant;
    AppStorage.removeItemFromStorage(login.storage);
    history.replace({ pathname: "/login" });
  };

  const handleBackClick = () => history.goBack();

  const adminMenuItem = [
    { name: "Dashboard", path: "/admin" },
    { name: "Add Expense Category", path: "/admin/expense/add" },
    { name: "Add Income Category", path: "/admin/income/add" },
    { name: "User Dashboard", path: "/user" },
    { name: "Add Expense", path: "/user/expense/add" },
    { name: "Add Income", path: "/user/income/add" },
    { name: "Expense Report", path: "/report" },
    { name: "Income Report", path: "/report" }
  ];
  const userMenuItem = [
    { name: "User Dashboard", path: "/user/" },
    { name: "Add Expense", path: "/user/expense/add" },
    { name: "Add Income", path: "/user/income/add" },
    { name: "Expense Report", path: "/report" },
    { name: "Income Report", path: "/report" }
  ];
  const defaultAdminMenuItem = [
    { name: "Expense Category List", path: "/admin/expense" },
    { name: "Income Category List", path: "/admin/income" },
    { name: "User Expense List", path: "/user/expense" },
    { name: "User Income List", path: "/user/income" }
  ];

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
      <MenuItem onClick={handleLogoutClick}>
        Want to logout, {username}?
      </MenuItem>
    </Menu>
  );

  const pageTitle = () => {
    const page = history.location.pathname;
    const list = isAdmin
      ? [...adminMenuItem, ...defaultAdminMenuItem]
      : userMenuItem;
    return list.some((x) => x.path === page)
      ? list.find((x) => x.path === page).name
      : "Dashboard";
  };

  const disableBackButton = isAdmin
    ? history.location.pathname === "/admin"
    : history.location.pathname === "/user";

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          {!disableBackButton && (
            <IconButton
              edge="start"
              aria-label="back navigation"
              aria-haspopup="false"
              onClick={handleBackClick}
              color="inherit"
            >
              <ChevronLeft />
            </IconButton>
          )}
          {/* <IconButton
            edge="start"
            aria-label="menu"
            aria-haspopup="false"
            onClick={(e) => toggleDrawerStatus(e, "toggle")}
            color="inherit"
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" className={classes.title}>
            {pageTitle()}
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
