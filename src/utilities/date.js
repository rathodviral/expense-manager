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
    }-${days}`,
  };
};

const AppDate = {
  getMonth: moment(new Date()).format("MMMM"),
  getDateIntoString: (dateObj, format = "YYYY-MM-DD") => {
    const date = typeof dateObj === "string" ? new Date(dateObj) : dateObj;
    return moment(date).format(format);
  },
  getCurrentMonthDates: {
    start: moment().startOf("month").format("YYYY-MM-DD"),
    end: moment().endOf("month").format("YYYY-MM-DD"),
  },
  geLast3MonthsDates: [0, 1, 2].map((x) => {
    return calculateDates(x);
  }),
};

export default AppDate;
