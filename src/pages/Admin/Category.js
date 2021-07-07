import React, { useContext, useState, useEffect } from "react";
import {
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Divider,
  AccordionActions,
  Button,
  Collapse,
  Slide,
  Dialog,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import { AppCard, AppInputField, AppDivider } from "../../components";
import { AdminContext } from "../../AdminContext";
import { useHistory, useParams } from "react-router-dom";
import { windowScrollTop } from "../../utilities";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  nested: {
    paddingLeft: theme.spacing(6),
  },
  appBar: {
    position: "relative",
  },
  dialogSaveButton: {
    marginLeft: "auto",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Category(params) {
  const classes = useStyles();
  let { type } = useParams();
  const history = useHistory();
  const adminCtx = useContext(AdminContext);
  const defaultList = adminCtx[`${type}CategoryList`];
  const [categoryList, setCategoryList] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    windowScrollTop();
    setCategoryList(defaultList);
  }, [defaultList]);

  const handleChange = (value) => {
    setSearchText(value);
    const list =
      value !== ""
        ? defaultList.filter((x) => x.name.toLowerCase().includes(value))
        : [...defaultList];
    setCategoryList(list);
  };

  const listCategoryClick = (value) => {
    // history.push(`${type}/edit/${value.id}`);
    toggleDialog(true);
  };
  const addSubCategoryClick = (value) => {
    history.push(`${type}/add/${value.id}`);
  };

  const listSubCategoryClick = (value) => {
    // history.push(`${type}/edit/${value.categoryId}/${value.id}`);
  };

  const toggleDialog = (flag) => {
    setOpenDialog(flag);
  };

  const AppListItem = (props) => {
    const {
      data: { name, isOpen, subCategoryList },
    } = props;
    const [open, setOpen] = React.useState(isOpen);
    const toggleCollapse = () => {
      setOpen(!open);
    };
    return (
      <React.Fragment>
        <ListItem button onClick={toggleCollapse}>
          <ListItemIcon>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                listCategoryClick(props.data);
              }}
            >
              <EditIcon />
            </IconButton>
          </ListItemIcon>
          <ListItemText
            primary={name}
            secondary={`Sub Categories ${subCategoryList.length}`}
          />
          {/* <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction> */}
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subCategoryList.map((item, i) => (
              <ListItem button key={i} className={classes.nested}>
                <ListItemText primary={item.name} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    listSubCategoryClick(item);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </React.Fragment>

      //   <ListItem button onClick={handleClick}>
      //   <ListItemIcon>
      //     <InboxIcon />
      //   </ListItemIcon>
      //   <ListItemText primary="Inbox" />
      //   {open ? <ExpandLess /> : <ExpandMore />}
      // </ListItem>
      // <Collapse in={open} timeout="auto" unmountOnExit>
      //   <List component="div" disablePadding>
      //     <ListItem button className={classes.nested}>
      //       <ListItemIcon>
      //         <StarBorder />
      //       </ListItemIcon>
      //       <ListItemText primary="Starred" />
      //     </ListItem>
      //   </List>
      // </Collapse>
    );
  };

  const AppAccordion = (props) => {
    const {
      data: { name, subCategoryList },
    } = props;

    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div className={classes.column}>
            <Typography className={classes.heading}>{name}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <List className={classes.root}>
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
            onClick={(e) => listCategoryClick(props.data)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={(e) => addSubCategoryClick(props.data)}
          >
            Add Sub Category
          </Button>
        </AccordionActions>
      </Accordion>
    );
  };

  const AppDialog = () => {
    return (
      <Dialog
        fullScreen
        open={openDialog}
        onClose={(e) => toggleDialog(false)}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={(e) => toggleDialog(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Sound
            </Typography>
            <Button
              autoFocus
              className={classes.dialogSaveButton}
              color="inherit"
              onClick={(e) => toggleDialog(false)}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItem>
        </List>
      </Dialog>
    );
  };

  return (
    <div>
      <AppCard title={`${type} Categories`}>
        <AppInputField
          name="search"
          label="Search Categories"
          type="search"
          helperText={null}
          isDisabled={false}
          isError={false}
          value={searchText}
          handleChange={handleChange}
        ></AppInputField>
        <AppDivider />
        {categoryList.map((item, i) => (
          <AppListItem key={i} data={item}></AppListItem>
        ))}
        <AppDialog></AppDialog>
      </AppCard>
    </div>
  );
}
