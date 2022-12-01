import { FormInputProps } from "../modals";

const API = {
  read: "read.php",
  create: "category_only/create.php",
  update: "category_only/update.php",
  delete: "category_only/delete.php"
};
const STORAGE = "USER-INFO";
const FORM_CONTROLS = {
  name: new FormInputProps({
    name: "name",
    label: "Category Name",
    type: "text"
  }),
  detail: new FormInputProps({
    name: "detail",
    label: "Category Detail",
    type: "text"
  })
};

const CATEGORY = {
  API,
  STORAGE,
  FORM_CONTROLS
};

export default CATEGORY;
