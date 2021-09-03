import React from "react";
import { makeStyles, Typography, Box } from "@material-ui/core";

const useStyles = makeStyles({
  text: { textAlign: "center", margin: "0", display: "block" },
  expense: {
    color: "#dc3545",
  },
  income: {
    color: "#28a745",
  },
  primary: {
    color: "#3f51b5",
  },
});

export default function AppInfoText(props) {
  const classes = useStyles();
  const { text, type = "primary", textList } = props;
  return textList && textList.length > 0 ? (
    <Box display="flex" flexDirection="row">
      {textList.map((item, key) => (
        <Box key={key} pr={1} width="50%">
          <Typography
            variant="overline"
            className={`${classes.text} ${classes[type]}`}
          >
            {item.title}
          </Typography>
          <Typography
            variant="h6"
            className={`${classes.text} ${classes[type]}`}
          >
            {item.text}
          </Typography>
        </Box>
      ))}
    </Box>
  ) : (
    <Typography variant="h6" className={`${classes.text} ${classes[type]}`}>
      {text}
    </Typography>
  );
}
