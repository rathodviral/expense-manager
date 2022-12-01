import { FormInputProps } from "../modals";

const API = "auth.php";
const STORAGE = "USER-INFO";
const FORM_CONTROLS = {
  username: new FormInputProps({
    name: "username",
    label: "Username",
    type: "text"
  }),
  password: new FormInputProps({
    name: "password",
    label: "password",
    type: "password"
  })
};

const LOGIN = {
  API,
  STORAGE,
  FORM_CONTROLS
};
export default LOGIN;
