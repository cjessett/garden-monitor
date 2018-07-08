import React from "react";

import { withStyles } from '@material-ui/core/styles';
import AccessTime from "@material-ui/icons/AccessTime";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import styles from "assets/jss/material-dashboard-react/components/switchStyle.jsx";

class Valve extends React.Component {
  render() {
    const { name, classes, isOpen, handleChange, avg } = this.props;
    const switchClasses = { switchBase: classes.colorSwitchBase, checked: classes.colorChecked, bar: classes.colorBar };
    return (
      <Card>
        <CardBody>
          <Grid container spacing={0} alignItems="center">
            <GridItem xs={6}>
              <h4 className={classes.cardTitle}>{name}</h4>
              <FormGroup row>
                <FormControlLabel
                  control={<Switch checked={isOpen} onChange={handleChange} value={name} classes={switchClasses} />}
                  label={isOpen ? 'Open' : 'Closed'}
                />
              </FormGroup>
            </GridItem>
            <GridItem xs={6}>
              <Typography variant="display2">{avg}</Typography>
            </GridItem>
          </Grid>
        </CardBody>
        <CardFooter chart>
          <span className={classes.stats}>
            <AccessTime /> updated 2 hours ago
          </span>
          <span href="#" style={{ float: 'right' }}><i className="material-icons">arrow_right_alt</i></span>
        </CardFooter>
      </Card>
    );
  }
}

export default withStyles(styles)(Valve);
