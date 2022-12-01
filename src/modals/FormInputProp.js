export default class FormInputProps {
  constructor({
    type,
    name,
    label,
    helperText,
    isDisabled,
    isError,
    multiline,
    value
  }) {
    this.type = type;
    this.name = name;
    this.label = label;
    this.value = value || "";
    this.helperText = helperText || null;
    this.isDisabled = isDisabled || false;
    this.isError = isError || false;
    this.multiline = multiline || false;
  }
}
