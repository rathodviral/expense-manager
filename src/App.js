import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { Home, Login } from "./pages";
import { Admin } from "./pages/Admin";

function App() {
  return (
    <div className="app">
      <Container maxWidth="xs" className="app-container">
        <Router>
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
          </Switch>
        </Router>
      </Container>
    </div>
  );
}

export default App;
