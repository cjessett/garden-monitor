import React from "react";
import { connect } from 'react-redux';
// @material-ui/core
import AddIcon from '@material-ui/icons/Add';
import Grid from "@material-ui/core/Grid";
// components
import GridItem from "components/Grid/GridItem.jsx";
import Button from 'components/CustomButtons/Button.jsx';
import Spinner from 'components/Loading/Loading.jsx';
import Valve from './Valve.jsx';
import NewValveForm from './NewValveForm.jsx';
import Filter from './VisbleValveFilter.jsx';
// Actions
import { createValve, getVisibleValves } from 'ducks/valves';
import { hydrate } from 'ducks';

class Dashboard extends React.Component {
  state = { formOpen: false };

  componentDidMount() {
    if (this.props.valves.length) return;
  }

  handleSubmit = ({ name, serial }) => {
    this.props.createValve({ name, serial });
    this.setState({ formOpen: false });
  }

  openForm = _ => this.setState({ formOpen: true });
  closeForm = _ => this.setState({ formOpen: false });

  render() {
    const { loading, isCreatingValve } = this.props;
    if (loading && !this.props.valves.length) return <Spinner />;
    const valves = this.props.valves.sort((a, b) => a.id > b.id).map(v => {
      return (
        <GridItem xs={12} sm={12} md={4} key={v.id}>
          <Valve {...v} />
        </GridItem>
      )
    });
    return (
      <div>
        <Filter />
        <Grid container alignItems="center">
          {valves}
          <GridItem xs={12} sm={12} md={4} style={{ textAlign: 'center' }}>
            {this.state.formOpen ?
              <NewValveForm handleSubmit={this.handleSubmit} closeForm={this.closeForm} /> :
              isCreatingValve ?
              <Spinner /> :
              <Button justIcon round color="info" aria-label="add" onClick={this.openForm}><AddIcon /></Button>}
          </GridItem>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  valves: getVisibleValves(state),
  loading: state.valves.loading,
  isCreatingValve: state.valves.creating,
});

const mapDispatchToProps = dispatch => ({
  createValve: valve => dispatch(createValve(valve)),
  load: _ => dispatch(hydrate()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
