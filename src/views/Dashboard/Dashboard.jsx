import React from "react";
import PropTypes from "prop-types";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import AddIcon from '@material-ui/icons/Add';
import Grid from "@material-ui/core/Grid";

import GridItem from "components/Grid/GridItem.jsx";
import Button from 'components/CustomButtons/Button.jsx';

import Valve from './Valve.jsx';
import NewValveForm from './NewValveForm.jsx';

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

const getAvg = _ => Math.floor(300 + Math.random()*500);

const data = [
  { name: 'Valve 1', id: 0, isOpen: false, avg: getAvg() },
  { name: 'Valve 2', id: 1, isOpen: false, avg: getAvg() },
  { name: 'Valve 3', id: 2, isOpen: false, avg: getAvg() },
];

class Dashboard extends React.Component {
  state = { valves: data, formOpen: false };

  handleChange = name => event => {
    this.setState(prevState => {
      const target = prevState.valves.find(v => v.name === name);
      const updatedValve = { ...target, isOpen: !target.isOpen };
      return { valves: [...prevState.valves.filter(v => v.name !== name), updatedValve]}
    });
  };

  handleSubmit = formData => {
    console.log(formData);
    const newValve = { name: formData.name, id: formData.serial, isOpen: false, avg: getAvg() };
    this.setState(prevState => ({ formOpen: false, valves: [...prevState.valves, newValve] }));
  }

  openForm = _ => this.setState({ formOpen: true });
  closeForm = _ => this.setState({ formOpen: false });

  render() {
    const { classes } = this.props;
    const valves = this.state.valves.sort((a, b) => a.id > b.id).map(v => {
      return (
        <GridItem xs={12} sm={12} md={4}>
          <a href={`#${v.name}`}>
          <Valve
            name={v.name}
            classes={classes}
            isOpen={this.state.valves.find(valve => valve.name === v.name).isOpen}
            handleChange={this.handleChange(v.name)}
            avg={v.avg}
          />
        </a>
      </GridItem>
      )
    });
    return (
      <div>
        <Grid container alignItems="center">
          {valves}
          <GridItem xs={12} sm={12} md={4} style={{ textAlign: 'center' }}>
            {this.state.formOpen ?
              <NewValveForm handleSubmit={this.handleSubmit} closeForm={this.closeForm} /> :
              <Button justIcon round color="info" aria-label="add" onClick={this.openForm}><AddIcon /></Button>}
          </GridItem>
        </Grid>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
