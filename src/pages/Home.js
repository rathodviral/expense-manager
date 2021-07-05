import React, { useEffect } from "react";
import { makeStyles, Card, CardMedia } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../AppContext";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    height: "100vh",
    flexDirection: "column",
  },
  card: {
    position: "relative",
  },
  media: {
    minHeight: 250,
    filter: "blur(2px)",
  },
  text: {
    color: "#fff",
    position: "absolute",
    top: "35%",
    width: "100%",
    textAlign: "center",
    textDecoration: "none",
    fontSize: "30px",
    textTransform: "uppercase",
    fontWeight: "500",
    letterSpacing: 9,
    textShadow: "0 0 5px black",
  },
});

export default function Home() {
  const classes = useStyles();
  const history = useHistory();
  const appCtx = useContext(AppContext);

  useEffect(() => {
    console.log(appCtx);
    const { username, isAdmin } = appCtx.getUserObject();
    if (username) {
      if (isAdmin) {
        history.replace({ pathname: "/admin/dashboard" });
      } else {
        history.replace({ pathname: "/user/dashboard" });
      }
    }
  }, []);

  return (
    <div className={classes.root}>
      <Card className={classes.card} variant="outlined">
        <CardMedia
          className={classes.media}
          image="bg.jpg"
          title="Paella dish"
        />
        <Link to="/login" className={classes.text}>
          Expense Manager
        </Link>
      </Card>
    </div>
  );
}
