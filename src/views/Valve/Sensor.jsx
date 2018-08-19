import React from 'react';
import { connect } from 'react-redux';

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import AccessTime from "@material-ui/icons/AccessTime";

import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Loading from "components/Loading/Mini";

import SoilClient from 'utils/Soil';
import { getSensor, updateMoisture } from 'ducks/sensors';

class Sensor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { connected: false };
    this.client = SoilClient({ serial: props.serial, onConnect: this.handleConnect, onMessage: this.handleMessage });
  }

  componentWillUnmount() {
    this.client.end();
  }

  handleConnect = () => {
    this.setState({ connected: true });
    this.client.getMoisture()
    .then((data = { moisture: '---', timestamp: Math.floor(Date.now()/1000) }) => {
      const { moisture, timestamp } = data;
      this.props.updateMoisture({ moisture, timestamp, id: this.props.id });
    });
  }

  handleMessage = (topic, payload) => {
    const { state: { reported: { moisture } }, timestamp } = JSON.parse(payload.toString());
    const d = new Date(0);
    d.setUTCSeconds(timestamp);
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZoneName: 'short', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const date = d.toLocaleDateString('en-US', opts);
    this.props.updateMoisture({ moisture, timestamp, id: this.props.id });
    this.setState({ date });
  }

  getLastUpdated() {
    const diffSeconds = Math.ceil(Date.now() / 1000) - this.props.timestamp;
    if (diffSeconds < 60) return `${Math.floor(diffSeconds)} seconds`
    const diffMins = diffSeconds / 60;
    if (diffMins < 60) return `${Math.floor(diffMins)} minutes`;
    const diffHours = diffMins / 60;
    return `${Math.floor(diffHours)} hours`;
  }

  render() {
    const { name, classes, moisture, timestamp } = this.props;
    return (
      <Card>
        <CardBody>
          <Grid container spacing={0} alignItems="center">
            <GridItem xs={6}>
              <h4 className={classes.cardTitle}>{name}</h4>
            </GridItem>
            <GridItem xs={6}>
              <Typography variant="display2">{moisture !== undefined ? moisture : <Loading />}</Typography>
            </GridItem>
          </Grid>
        </CardBody>
        <CardFooter chart>
          {timestamp && <span className={classes.stats}>
            <AccessTime /> updated {this.getLastUpdated()} ago
          </span>}
        </CardFooter>
      </Card>
    );
  }
}

const mapStateToProps = (state, { id }) => getSensor(state, id);

export default connect(mapStateToProps, { updateMoisture })(Sensor);
