const paidOptions = [
  { id: true, name: "Paid" },
  { id: false, name: "Not Paid" }
];

export default class FormSelectProps {
  constructor({
    name,
    label,
    helperText,
    isDisabled,
    isError,
    options,
    value
  }) {
    this.type = "select";
    this.name = name;
    this.label = label;
    this.value = value || null;
    this.helperText = helperText || null;
    this.isDisabled = isDisabled || false;
    this.isError = isError || false;
    this.options = options || name === "isPaid" ? paidOptions : [];
  }
}
