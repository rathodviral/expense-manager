import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function AppSelectField(props) {
  const {
    margin = "normal",
    isDisabled = false,
    isError = false,
    name,
    label,
    value,
    handleChange,
    options = [],
  } = props;

  const [fieldValue, setFieldValue] = useState(value);

  useEffect(() => {
    setFieldValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Autocomplete
      id={name}
      options={options}
      renderOption={(option) => <React.Fragment>{option.name}</React.Fragment>}
      value={fieldValue}
      onChange={(event, newValue) => handleChange(newValue.id, name)}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{
            shrink: true,
          }}
          margin={margin}
          variant="outlined"
          size="small"
          label={label}
          fullWidth
        />
      )}
    />
  );
}
