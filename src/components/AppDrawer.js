import React, { useContext } from "react";
import { Box, Drawer, List, ListItem, ListItemText } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { AppContext } from "../contexts";

export default function AppDrawer() {
  const { isDrawerOpen, toggleDrawerStatus, getUserObject } =
    useContext(AppContext);
  const history = useHistory();
  const { isAdmin } = getUserObject();

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
  const menuList = (list) => (
    <Box sx={250} role="presentation">
      <List>
        {list.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => {
              console.log(item);
              history.push({ pathname: item.page });
              toggleDrawerStatus(null, false);
            }}
          >
            {/* <ListItemIcon>
              <PersonAdd />
            </ListItemIcon> */}
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={() => toggleDrawerStatus(null, false)}
    >
      {menuList(isAdmin ? adminMenuItem : userMenuItem)}
    </Drawer>
  );
}
