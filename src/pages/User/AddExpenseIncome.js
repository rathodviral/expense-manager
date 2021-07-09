import React, { useContext, useEffect, useState } from "react";
import {
  AppCard,
  AppInputField,
  AppButton,
  AppSelectField,
} from "../../components";
import { useParams } from "react-router-dom";
import {
  AppApiFetch,
  setValuesInObject,
  validateObject,
} from "../../utilities";
import { FormControlLabel, Switch } from "@material-ui/core";
import { AppContext, UserContext } from "../../contexts";

export default function AddExpenseIncome(props) {
  const { getUserDataEvent } = props;
  const { type } = useParams();
  const { showSnackbar, getUserObject } = useContext(AppContext);
  const { incomeCategoryList, expenseCategoryList, getDataFromConstant } =
    useContext(UserContext);
  const isExpense = type === "expense";
  const defailtFields = getDataFromConstant("fields");

  const [modifiedFields, setModifiedFields] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [isPaid, setPaid] = useState(true);

  useEffect(() => {
    const list = getCategoryOptions();
    const fieldsWithOptions = defailtFields.map((element) => {
      return {
        ...element,
        options: element.name === "category" ? list : element.options || null,
      };
    });
    setModifiedFields(fieldsWithOptions);
    setFormFields(fieldsWithOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomeCategoryList, expenseCategoryList]);

  const getCategoryOptions = () => {
    const l = isExpense ? expenseCategoryList : incomeCategoryList;
    return l.map((x) => {
      return {
        id: x.id,
        name: x.name,
      };
    });
  };

  const getSubCategoryOptions = (category) => {
    const l = isExpense ? expenseCategoryList : incomeCategoryList;
    const { subCategoryList } = l.find((x) => x.id === category) || {
      subCategoryList: [],
    };
    return subCategoryList.map((x) => {
      return {
        id: x.id,
        name: x.name,
      };
    });
  };

  const getFormData = (withFilter = false) => {
    const { username } = getUserObject();
    let obj = { isExpense, user: username, isPaid };
    formFields.forEach((field) => {
      const { name, value, type } = field;
      if (withFilter) {
        if (type === "select") {
          obj[name] = value && value.id ? value.id : value;
        } else {
          if (name === "amount") {
            obj[name] = Number(value);
          } else {
            obj[name] = value;
          }
        }
      } else {
        obj[name] = value;
      }
    });
    return obj;
  };

  const handleChange = (value, name) => {
    const formData = getFormData();
    const modifiedFormdata = { ...formData, [name]: value };
    const fields = setValuesInObject(modifiedFormdata, modifiedFields);
    if (name === "category") {
      const subList = value && value.id ? getSubCategoryOptions(value.id) : [];
      const fieldsWithOptions = fields.map((element) => {
        return {
          ...element,
          options: element.name === "detail" ? subList : element.options,
          value: element.name === "detail" ? "" : element.value,
        };
      });
      setFormFields(fieldsWithOptions);
    } else {
      setFormFields(fields);
    }
  };

  const formSubmit = async () => {
    const formData = getFormData(true);
    console.log(formData);
    console.log(modifiedFields);

    if (Object.values(formData).some((item) => !item || item === "")) {
      const fD = getFormData();
      const fields = validateObject(fD, modifiedFields);
      setFormFields(fields);
      return;
    }
    const { family } = getUserObject();
    const { create } = getDataFromConstant("apiPath");

    const options = {
      method: "POST",
      body: formData,
      queryParams: { family },
    };

    // const response = await AppApiFetch(create, options);
    // const { status, message } = await response.json();
    // showSnackbar(message);
    // setFormFields(listFields);
    // if (status) {
    //   getUserDataEvent();
    // }
  };

  return (
    <div>
      <AppCard title={`Add ${type}`}>
        <form noValidate autoComplete="off">
          {formFields &&
            formFields.map((field, i) =>
              field.type === "select" ? (
                <AppSelectField
                  {...field}
                  key={i}
                  handleChange={handleChange}
                />
              ) : (
                <AppInputField {...field} key={i} handleChange={handleChange} />
              )
            )}
          <FormControlLabel
            control={
              <Switch
                checked={isPaid}
                onChange={(e) => setPaid(e.target.checked)}
                name="checkedB"
                color="primary"
              />
            }
            label={isPaid ? "Paid" : "Not Paid"}
          />
          <AppButton onClick={formSubmit}>Save {type}</AppButton>
        </form>
      </AppCard>
    </div>
  );
}
