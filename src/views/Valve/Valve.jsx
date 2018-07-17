import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.jsx";
import Button from 'components/CustomButtons/Button.jsx';
import Spinner from 'components/Loading/Loading.jsx';
import MiniLoad from 'components/Loading/Mini.jsx';
import NewSensorForm from './NewSensorForm.jsx';
import Sensor from './Sensor.jsx';

import styles from "assets/jss/material-dashboard-react/components/valveCardStyle.jsx";
import ValveClient from 'utils/ValveClient';

import { toggleValve, getValve } from 'ducks/valves';
import { createSensor, getSensors, getAverage } from 'ducks/sensors';

class Valve extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formOpen: false };
    this.client = ValveClient({ thingName: this.props.name, onMessage: this.handleMessage });
  }

  componentDidMount() {
    this.client.isValveOpen().then(isOpen => this.setState({ isOpen, fetched: true }));
    if (this.props.name) return;
  }

  handleChange = ({ target: { checked } }) => {
    const desiredValveState = checked ? 'open' : 'closed';
    this.client.toggleValve(desiredValveState)
    .then(() => this.props.toggleValve({ id: this.props.id, isOpen: checked }))
  }

  handleMessage = (topic, payload) => {
    const { state: { reported } } = JSON.parse(payload);
    if (!reported) return;
    if (reported.valve) this.props.toggleValve({ id: this.props.id, isOpen: reported.valve });
  }

  handleSubmit = ({ name, serial }) => {
    this.props.createSensor({ name, serial, valveId: this.props.id });
    this.setState({ formOpen: false });
  }

  openForm = _ => this.setState({ formOpen: true });
  closeForm = _ => this.setState({ formOpen: false });

  render() {
    const { name, isOpen, average, classes, sensors, loading, isUpdatingValve, isCreatingSensor } = this.props;
    if (loading && !name) return <Spinner />;
    const switchClasses = { switchBase: classes.colorSwitchBase, checked: classes.colorChecked, bar: classes.colorBar };
    const sensorCards = sensors.map(s => <GridItem xs={12} sm={12} md={4} key={s.id}><Sensor {...s} classes={classes} /></GridItem>)
    return (
      <Grid container direction="column">
        <GridItem>
          <Typography variant="display3">{name}</Typography>
        </GridItem>
        <GridItem>
          <Typography variant="display1">Average: {average}</Typography>
        </GridItem>
        <GridItem>
          <FormGroup row>
            <span>
              <FormControlLabel
                control={<Switch checked={isOpen} onChange={this.handleChange} value={name} classes={switchClasses} />}
                label={isUpdatingValve ? <MiniLoad /> : (isOpen ? 'Open' : 'Closed')}
              />
            </span>
          </FormGroup>
        </GridItem>
        <Grid container alignItems="center">
          {sensorCards}
          <GridItem xs={12} sm={12} md={4} style={{ textAlign: 'center' }}>
            {this.state.formOpen ?
              <NewSensorForm handleSubmit={this.handleSubmit} closeForm={this.closeForm} /> :
              isCreatingSensor ?
              <Spinner /> :
              <Button justIcon round color="info" aria-label="add" onClick={this.openForm}><AddIcon /></Button>}
          </GridItem>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const valveId = Number(ownProps.match.params.id);
  const valve = getValve(state, valveId);
  const sensors = getSensors(state, valveId);
  const average = getAverage(state, valveId);
  const isUpdatingValve = state.valves.updating;
  const isCreatingSensor = state.sensors.creating;
  const loading = state.valves.loading;
  return { ...valve, sensors, average, loading, isUpdatingValve, isCreatingSensor };
}

const mapDispatchToProps = dispatch => ({
  toggleValve: ({ id, isOpen }) => dispatch(toggleValve({ id, isOpen })),
  createSensor: sensor => dispatch(createSensor(sensor)),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Valve));
