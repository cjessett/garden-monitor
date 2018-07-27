import React from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

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
import MiniLoad from "components/Loading/Mini.jsx";

import { toggleValve, isUpdatingId, getValve } from 'ducks/valves';
import { getSensors, getAverage, updateMoisture } from 'ducks/sensors';

import ValveClient from 'utils/ValveClient';
import SoilClient from 'utils/Soil';

import styles from "assets/jss/material-dashboard-react/components/valveCardStyle.jsx";

class Valve extends React.Component {
  constructor(props) {
    super(props);
    this.client = ValveClient({ thingName: this.props.name, onMessage: this.handleMessage });
    this.sensorClients = props.sensors.map(s => {
      const client = SoilClient({ thingName: s.name, onConnect: this.handleSensorConnect(s.id), onMessage: () => {} });
      return { id: s.id, client };
    });
  }

  componentDidMount = () => {
    return this.client.isValveOpen().then(isOpen => this.setState({ isOpen, fetched: true }));
  }

  componentWillUnmount() {
    this.client.end();
  }

  handleChange = ({ target: { checked } }) => {
    const desiredValveState = checked ? 'open' : 'closed';
    this.client.toggleValve(desiredValveState)
    .then(() => this.props.toggleValve({ id: this.props.id, isOpen: checked }));
  }

  handleMessage = (topic, payload) => {
    const { state: { reported } } = JSON.parse(payload);
    if (!reported) return;
    if (reported.valve) {
      this.props.toggleValve({ id: this.props.id, isOpen: reported.valve === 'open' });
    }
  }

  handleSensorConnect = id => () => {
    this.sensorClients.find(s => s.id === id).client
    .getMoisture()
    .then(({ moisture, timestamp }) => {
      this.props.updateMoisture({ moisture, timestamp, id });
    });
  }

  handleSensorMessage = id => (topic, payload) => {
    const { state: { reported: { moisture } }, timestamp } = JSON.parse(payload.toString());
    const d = new Date(0);
    d.setUTCSeconds(timestamp);
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZoneName: 'short', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const date = d.toLocaleDateString('en-US', opts);
    this.props.updateMoisture({ moisture, timestamp, id: this.props.id });
    this.setState({ date });
  }

  getLastUpdated(timestamp) {
    const diffSeconds = Math.ceil(Date.now() / 1000) - timestamp;
    if (diffSeconds < 60) return `${Math.floor(diffSeconds)} seconds`
    const diffMins = diffSeconds / 60;
    if (diffMins < 60) return `${Math.floor(diffMins)} minutes`;
    const diffHours = diffMins / 60;
    return `${Math.floor(diffHours)} hours`;
  }

  render() {
    const { id, name, classes, isOpen, average, isUpdating, sensors } = this.props;
    const timestamp = sensors.sort((a, b) => a.timestamp > b.timestamp)[0].timestamp;
    const switchClasses = { switchBase: classes.colorSwitchBase, checked: classes.colorChecked, bar: classes.colorBar };
    return (
      <Card>
        <CardBody>
          <Grid container spacing={0} alignItems="center">
            <GridItem xs={6}>
              <h4 className={classes.cardTitle}>{name}</h4>
              <FormGroup row>
                <FormControlLabel
                  control={<Switch checked={isOpen} onChange={this.handleChange} value={name} classes={switchClasses} />}
                  label={isUpdating ? <MiniLoad /> : (isOpen ? 'Open' : 'Closed')}
                />
              </FormGroup>
            </GridItem>
            <GridItem xs={6}>
              <Typography variant="display2">{average ? average : <MiniLoad />}</Typography>
            </GridItem>
          </Grid>
        </CardBody>
        <CardFooter chart>
          {timestamp && <span className={classes.stats}>
            <AccessTime /> updated {this.getLastUpdated(timestamp)} ago
          </span>}
          <span href="#" style={{ float: 'right' }}>
            <Link to={`/valves/${id}`}><i className="material-icons">arrow_right_alt</i></Link>
          </span>
        </CardFooter>
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const valveId = Number(ownProps.id);
  const valve = getValve(state, valveId);
  const sensors = getSensors(state, valveId);
  const average = getAverage(state, valveId);
  const loading = state.valves.loading;
  const isUpdating = isUpdatingId(state, valveId);
  return { ...valve, sensors, average, loading, isUpdating };
};

export default connect(mapStateToProps, { toggleValve, updateMoisture })(withStyles(styles)(Valve));
