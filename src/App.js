import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Home, Login, Admin, User } from "./pages";
import {
  AdminContextProvider,
  AppContextProvider,
  UserContextProvider
} from "./contexts";
import { AppSnackbar, AppAlertDialog } from "./components";
import MomentUtils from "@date-io/moment";
import Report from "./pages/Report";

function App() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <AppContextProvider>
        <AdminContextProvider>
          <UserContextProvider>
            <div className="app">
              <Container maxWidth="xs" className="app-container">
                <Router basename={"v2"}>
                  <Switch>
                    <Route exact path="/">
                      <Home />
                    </Route>
                    <Route path="/login">
                      <Login />
                    </Route>
                    <Route path="/admin">
                      <Admin />
                    </Route>
                    <Route path="/user">
                      <User />
                    </Route>
                    <Route exact path="/report">
                      <Report />
                    </Route>
                  </Switch>
                </Router>
                <AppSnackbar />
                <AppAlertDialog />
              </Container>
            </div>
          </UserContextProvider>
        </AdminContextProvider>
      </AppContextProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
