export default class FormDateProps {
  constructor({
    name,
    label,
    helperText,
    isDisabled,
    isError,
    value,
    format,
    minDate
  }) {
    this.type = "date";
    this.name = name;
    this.label = label;
    this.value = value || new Date();
    this.helperText = helperText || "";
    this.isDisabled = isDisabled || false;
    this.isError = isError || false;
    this.format = format || "YYYY-MM-DD";
    this.minDate = minDate || false;
  }
}
