import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.jsx";
import Button from 'components/CustomButtons/Button.jsx';
import Spinner from 'components/Loading/Loading.jsx';
import NewSensorForm from '../Valve/NewSensorForm.jsx';
import Sensor from '../Valve/Sensor.jsx';

import styles from "assets/jss/material-dashboard-react/components/valveCardStyle.jsx";

import { createSensor, getSensors } from 'ducks/sensors';

const RegisterSensor = ({ onClick }) => (
  <p style={{ padding: '15px 20px', textAlign: 'center', border: '1px solid #d8dee2', borderRadius: '5px' }}>
    To get started, <a href="#register" onClick={onClick}>Register a Sensor</a>
  </p>
)

class SensorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formOpen: false };
  }

  handleSubmit = ({ name, serial }) => {
    this.props.createSensor({ name, serial });
    this.setState({ formOpen: false });
  }

  openForm = _ => this.setState({ formOpen: true });
  closeForm = _ => this.setState({ formOpen: false });

  render() {
    const { classes, sensors, loading, isCreatingSensor } = this.props;
    if (loading) return <Spinner />;
    const sensorCards = sensors.map(s => <GridItem xs={12} sm={12} md={4} key={s.id}><Sensor {...s} classes={classes} /></GridItem>)
    return (
      <Grid container alignItems="center">
        {sensorCards}
        <GridItem xs={12} sm={12} md={4} style={{ textAlign: 'center' }}>
          {this.state.formOpen ?
            <NewSensorForm handleSubmit={this.handleSubmit} closeForm={this.closeForm} /> :
            isCreatingSensor ?
            <Spinner /> :
            this.props.sensors.length ?
              (<Button justIcon round color="info" aria-label="add" onClick={this.openForm}><AddIcon /></Button>) :
              <RegisterSensor onClick={this.openForm} />
            }
        </GridItem>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  const sensors = getSensors(state);
  const isCreatingSensor = state.sensors.creating;
  const loading = state.sensors.loading;
  return { sensors, loading, isCreatingSensor };
}

export default withStyles(styles)(connect(mapStateToProps, { createSensor })(SensorPage));
