import { AppDate } from "../utilities";

const { start } = AppDate.getCurrentMonthDates;

const API = "exp_data/read_data_by_date.php";
const STORAGE = "EXPENSE-INFO";
const FORM_CONTROLS = {
  search: {
    startDate: {
      name: "startDate",
      label: "Start date",
      type: "startDate",
      helperText: null,
      isDisabled: false,
      isError: false,
      multiline: false,
      value: start
    },
    endDate: {
      name: "endDate",
      label: "End date",
      type: "endDate",
      helperText: null,
      isDisabled: false,
      isError: false,
      multiline: false,
      value: AppDate.getDateIntoString()
    }
  }
};
const REPORT = { API, STORAGE, FORM_CONTROLS };

export default REPORT;
