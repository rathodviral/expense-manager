import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function AppSelectField(props) {
  const classes = useStyles();
  const {
    isDisabled = false,
    isError = false,
    name,
    label,
    value,
    handleChange,
    helperText = "",
    defaultValue = null,
    options = [],
  } = props;
  const [fieldValue, setFieldValue] = useState(value);

  useEffect(() => {
    setFieldValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <FormControl
      variant="outlined"
      className={classes.formControl}
      disabled={isDisabled}
      error={isError}
      size="small"
    >
      <InputLabel id="demo-simple-select-placeholder-label-label">
        {label}
      </InputLabel>
      <Select
        labelId={name}
        id={name}
        value={fieldValue}
        onChange={handleChange}
        className={classes.selectEmpty}
      >
        {defaultValue && (
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem value={option}>{option.name || option}</MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
