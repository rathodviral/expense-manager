import { FormDateProps, FormInputProps, FormSelectProps } from "../modals";

const API = {
  read: "read.php",
  create: "exp_data/create.php",
  update: "exp_data/update.php",
  delete: "exp_data/delete.php"
};

const category = new FormSelectProps({
  name: "category",
  label: "Expense Category"
});

const FORM_CONTROLS = {
  add: {
    date: new FormDateProps({
      name: "date",
      label: "Category date"
    }),
    category,
    amount: new FormInputProps({
      name: "amount",
      label: "Expense Amount",
      type: "number"
    }),
    note: new FormInputProps({
      name: "note",
      label: "Expense Detail",
      type: "text"
    })
  },
  search: {
    date: new FormDateProps({
      name: "date",
      label: "Select date"
    }),
    user: new FormSelectProps({
      name: "user",
      label: "Select User"
    }),
    isPaid: new FormSelectProps({
      name: "isPaid",
      label: "Select Paid/Not Paid"
    }),
    category
  }
};

const EXPENSE = { API, FORM_CONTROLS };

export default EXPENSE;
