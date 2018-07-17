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

import { toggleValve, isUpdatingId, getValve, getAverage } from 'ducks/valves';

import ValveClient from '../../utils/ValveClient';

import styles from "assets/jss/material-dashboard-react/components/valveCardStyle.jsx";

class Valve extends React.Component {
  constructor(props) {
    super(props);
    this.client = ValveClient({ thingName: this.props.name, onMessage: this.handleMessage })
  }

  componentDidMount = () => {
    return this.client.isValveOpen().then(isOpen => this.setState({ isOpen, fetched: true }))
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

  render() {
    const { id, name, classes, isOpen, average, isUpdating } = this.props;
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
              <Typography variant="display2">{average}</Typography>
            </GridItem>
          </Grid>
        </CardBody>
        <CardFooter chart>
          <span className={classes.stats}>
            <AccessTime /> updated 2 hours ago
          </span>
          <span href="#" style={{ float: 'right' }}>
            <Link to={`/valves/${id}`}><i className="material-icons">arrow_right_alt</i></Link>
          </span>
        </CardFooter>
      </Card>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  toggleValve: ({ id, isOpen }) => dispatch(toggleValve({ id, isOpen })),
})

// const mapStateToProps = (state, ownProps) => ({
//   average: getAverage(state, ownProps.id),
//   isUpdating: isUpdatingId(state, ownProps.id),
// })
const mapStateToProps = (state, ownProps) => ({
  ...getValve(state, ownProps.id),
  isUpdating: isUpdatingId(state, ownProps.id),
  average: getAverage(state, ownProps.id),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Valve));
