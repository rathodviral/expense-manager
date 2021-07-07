import React from "react";
import {
  List,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Divider,
  AccordionActions,
  Button,
  AppListItem,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default function AppAccordion(props) {
  const {
    data: { name, subCategoryList, listItemClick },
  } = props;

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1c-content"
        id="panel1c-header"
      >
        <div>
          <Typography>{name}</Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {subCategoryList.map((item, i) => (
            <AppListItem key={i} data={item}></AppListItem>
          ))}
        </List>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button size="small" variant="contained">
          Delete
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={(e) => listItemClick(false, props.data)}
        >
          Edit
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={(e) => listItemClick(true, props.data)}
        >
          Add Sub Category
        </Button>
      </AccordionActions>
    </Accordion>
  );
}
