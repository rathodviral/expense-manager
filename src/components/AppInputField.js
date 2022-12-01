import React from "react";
import TextField from "@material-ui/core/TextField";

export default function AppInputField({
  margin = "normal",
  isDisabled = false,
  isError = false,
  multiline = false,
  rows = null,
  name,
  label,
  type,
  helperText = null,
  value = "",
  handleChange
}) {
  return (
    <TextField
      variant="outlined"
      size="small"
      InputLabelProps={{
        shrink: true
      }}
      fullWidth
      disabled={isDisabled}
      error={isError}
      margin={margin}
      type={type}
      id={name}
      label={label}
      helperText={helperText}
      value={value}
      multiline={multiline}
      rows={rows}
      onChange={(e) => handleChange(e.target.value, name)}
    />
  );
}
