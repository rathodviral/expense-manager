import React, { useState, useEffect } from "react";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { AppDate } from "../utilities";

export default function AppDateField(props) {
  const {
    margin = "normal",
    isDisabled = false,
    isError = false,
    name,
    label,
    value,
    handleChange,
    helperText = "",
    format = "YYYY-MM-DD",
    minDate = AppDate.getPreviousThirdDay,
    maxDate = AppDate.getPreviousThirdDay,
  } = props;
  const [fieldValue, setFieldValue] = useState(value);

  useEffect(() => {
    setFieldValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <KeyboardDatePicker
      margin={margin}
      id={name}
      label={label}
      format={format}
      value={fieldValue}
      onChange={(e) => handleChange(e, name)}
      disabled={isDisabled}
      error={isError}
      helperText={helperText}
      inputVariant="outlined"
      size="small"
      InputLabelProps={{
        shrink: true,
      }}
      disableFuture={true}
      minDate={minDate}
      maxDate={maxDate}
      fullWidth
    />
  );
}
