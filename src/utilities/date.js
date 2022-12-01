import moment from "moment";

const calculateDates = (m) => {
  const month = moment().month();
  const cMonth = month - m;
  const year = moment().year();
  const days = moment(
    `${year}-${month === 10 || month === 11 ? month : "0" + cMonth}`,
    "YYYY-MM"
  ).daysInMonth();
  return {
    start: `${year}-${month === 10 || month === 11 ? month : "0" + cMonth}-01`,
    end: `${year}-${
      month === 10 || month === 11 ? month : "0" + cMonth
    }-${days}`
  };
};

const AppDate = {
  getMonth: moment(new Date()).format("MMMM"),
  getDateIntoString: (dateObj = new Date(), format = "YYYY-MM-DD") => {
    const date = typeof dateObj === "string" ? new Date(dateObj) : dateObj;
    return moment(date).format(format);
  },
  getDateFromString: (date) => {
    const parts = date.split("-");
    const mydate = new Date(parts[0], parts[1] - 1, parts[2]);
    return mydate;
  },
  getCurrentMonthDates: {
    start: moment().startOf("month").format("YYYY-MM-DD"),
    end: moment().endOf("month").format("YYYY-MM-DD")
  },
  getLast3MonthsDates: [0, 1, 2].map((x) => calculateDates(x)),
  getPreviousThirdDay: moment().subtract(3, "days"),
  getPreviousThreeMonth: moment().subtract(6, "months")
};

export default AppDate;
